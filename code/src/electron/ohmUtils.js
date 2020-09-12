import path from 'path'
import { exec } from 'child_process'

const execPromise = ( command, options = { shell: 'powershell.exe' } ) => new Promise(( resolve, reject ) => {
  exec(command, options, ( err, stdout, stderr ) => { if (err) reject(err); if (stderr) reject(stderr); resolve(stdout) })
})

const nssmPath = path.join(process.cwd(), 'src/electron/nssm/nssm.exe')
const SERVICE_NAME = 'SmartMonitOHM'


export const startOhmService = async () => {
  try {
    // First, check if Service already exists. If not, create it.
    let serviceStatus = await _getServiceStatus()
    if (!serviceStatus) {
      await _createService()

      // After we created the service, get it's status again
      serviceStatus = await _getServiceStatus()
    }

    if (serviceStatus == 'Running')
      return

    console.log('[OHM] Service exists and isn\'t running already')

    // Service exists and isn't running already
    await execPromise(`Start-Service -Name "${SERVICE_NAME}"`) // ${nssmPath} start ${SERVICE_NAME}
    console.log('[OHM] Successfully started service.')
  
  } catch (err) {
    console.error('\n\n--- Error while trying to start OHM Windows Service ---\n', err)
  }
}


export const getOhmData = async ( trials = 8 ) => {
  const filter = ['Temperature', 'Load', 'Control', 'Fan', 'SmallData', 'Data'].map(entry => `SensorType like '${entry}'`).join(' OR ')
  
  // Loop, because it may be can take a few secs for the data to get delivered.
  let doneTrials = 0
  while (doneTrials < trials) {
    try {
      const execRes = await execPromise(`Get-CimInstance -namespace root/OpenHardwareMonitor -ClassName Sensor -Filter "${filter}" | ConvertTo-JSON`)
      if (execRes && execRes.length) 
        return _formatOhmData(execRes)

    } catch (error) {
      console.error(`\n\n--- Error after ${doneTrials + 1} times trying to get data from ohm ---\n`, error)
      break
    }

    await _sleep(3000)
    doneTrials++
  }
}


export const stopOhmService = async () => {
  try {
    await execPromise(`${nssmPath} stop ${SERVICE_NAME}`)
    console.log('[OHM] Stopped service.')
  } catch (_) {}
}


// --- Private Helpers ---

const _sleep = ( ms ) => new Promise(resolve => setTimeout(resolve, ms))

const _getServiceStatus = async () => {
  try {
    return await execPromise(`(Get-Service "${SERVICE_NAME}").Status`) // `${nssmPath} status ${SERVICE_NAME}`
  } catch (_) {
    console.log(`[OHM] Trying to get the service-status, but the service doesn't exist yet.`)
    return null
  }
}

const _createService = async () => {
  try {
    const ohmPath = path.join(process.cwd(), 'src/electron/ohm/OpenHardwareMonitor.exe')
    await execPromise(`${nssmPath} install ${SERVICE_NAME} ${ohmPath}`)
    await execPromise(`${nssmPath} set ${SERVICE_NAME} Start SERVICE_DEMAND_START`)

    console.log(`[OHM] Successfully created service.`)
  } catch (err) {
    console.error('\n\n--- Error while trying to create OHM Windows Service ---\n', err)
  }
}

/**
 * @param {string} rawDataString a string of JSON data returned from the PowerShell
 */
const _formatOhmData = ( rawDataString, _debugFileName = 'default' ) => {
  try {
    let jsonArr = JSON.parse(rawDataString)

    // Remove unneeded data that would blow up the whole thing.
    jsonArr = jsonArr.map(entry => {
      let { CimClass, CimInstanceProperties, CimSystemProperties, ...filtered } = entry
      return filtered
    })

    // fs.writeFileSync(path.join(process.cwd(), `debug/jsonArr.json`), JSON.stringify(jsonArr, null, 2))

    // Sort by type (cpu, gpu, ram, ...) & Format the data entries
    let data = { cpu: {}, gpu: {}, ram: {}, ssd: {} }
    for (const sensorObj of jsonArr) {
      const sensorLocation = _detectSensorLocation(sensorObj)
      switch (sensorLocation) {
        case 'gpu': case 'cpu': {
          if (sensorObj.Identifier.endsWith('/temperature/0')) 
            data[sensorLocation].temperature = _sensorFormatMinMax(sensorObj)
          else if (sensorObj.Identifier.endsWith('/control/0'))
            data[sensorLocation].fan = sensorObj.Value
          else if (sensorObj.Identifier.endsWith('/load/0'))
            data[sensorLocation].load = _sensorFormatMinMax(sensorObj)
          break
        }

        case 'ram':
          if (sensorObj.Identifier.endsWith('/data/0'))
            data.ram.used = _sensorFormatMinMax(sensorObj)
          else if (sensorObj.Identifier.endsWith('/data/1'))
            data.ram.available = _sensorFormatMinMax(sensorObj)
          break

        case 'ssd':
          if (sensorObj.Identifier.endsWith('/temperature/0'))
            data.ssd.temperature = _sensorFormatMinMax(sensorObj)

        default:
          break;
      }
    }

    // Edit the ram.available value to get the whole amount of RAM that is built into the PC.
    data.ram.available = data.ram.used.curr + data.ram.available.curr

    return data
  } catch (err) {
    console.error('\n\n--- Error while trying to parse OHM Data JSON string ---\n', err)
  }
}

/**
 * @param {object} dataObj The object of one sensor information
 * @returns {string} The location of the sensor. Possible values: "cpu", "gpu", "ram", "ssd", "_unspecific"
 */
const _detectSensorLocation = ( dataObj ) => {
  if (dataObj.Parent.includes('cpu')) return 'cpu'
  else if (dataObj.Parent.includes('gpu')) return 'gpu'
  else if (dataObj.Parent.includes('ram')) return 'ram'
  else if (dataObj.Parent.includes('hdd')) return 'ssd'
  return '_unspecific'
}

const _sensorFormatMinMax = ( dataObj ) => ({ min: dataObj.Min, max: dataObj.Max, curr: dataObj.Value })