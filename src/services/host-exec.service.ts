import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { JYLib_LoggerService, LOG_ERROR, LOG_INFO } from './logger.service';

/** ===============================================
 * JYLIb_HostExecService
 * 
 * Execute command in the host
 * 
 * Following env parameters are required:
 * - HOST_USER_PWD: host user id
 * - HOST_USER_ID: host user password
 * - HOST_IP: host ip address
 */
@Injectable()
export class JYLIb_HostExecService {
  constructor(private logger: JYLib_LoggerService) {
    this.logger.appName = 'HostExecService';
  }

  /**
   * Executes command in the host
   * @param cmdStr - command line
   * @param [runAsSudo] - boolean
   * @returns execute error, null if no error
   */
  async execute(cmdStr: string, runAsSudo: boolean = false): Promise<any> {
    if (runAsSudo) {
      cmdStr = `"echo ${process.env.HOST_USER_PWD} | sudo -S ${cmdStr}"`;
    }

    const cmd = `sshpass -p '${process.env.HOST_USER_PWD}' ssh -q -o StrictHostKeyChecking=no ${process.env.HOST_USER_ID}@${process.env.DOCKER_HOST_IP} ${cmdStr}`;
    LOG_INFO(this, `execute(): cmd=${cmd.replace(process.env.HOST_USER_PWD, '****')}`);

    let stdoutStr = '', stderrStr = '';
    try {
      const procOutputs = await new Promise(
        (resolve, reject) => {
          exec(cmd, (err, stdout, stderr) => {
            stdoutStr = stdout.toString();
            stderrStr = stderr.toString();
            //this.logger.log(`stdout: ${stdout}`);
            if (err) {
              reject({ err, stdout, stderr});
            }
            if (stderr) {
              if (err != undefined) {
                //this.logger.log(`stderr: ${stderr}`);
                reject({ err, stdout, stderr });
              }
            }
            resolve({ err, stdout, stderr });
          });
        });
    }
    catch (e) {
      if (typeof e?.err?.cmd == 'string') {
        e.err.cmd = e.err.cmd.replace(process.env.HOST_USER_PWD, '****');
      }

      LOG_ERROR(this, 'execute(): cmd error:', e.trace);

      if (e.err != undefined) {
        e.errStr = JSON.stringify(e.err, Object.getOwnPropertyNames(e.err));
      } else {
        e.errStr = 'Unknown Error';
      }
      e.errStr = e.errStr.replace(/\\n/g, '\n').replace(process.env.HOST_USER_PWD, '****');
      LOG_ERROR(this, e.errStr, e.trace);
      return e;
    }
    LOG_INFO(this, `<stdout>=\n${stdoutStr}`);
    if (stderrStr != '') {
      LOG_INFO(this, '');
      LOG_INFO(this, `<stderr>=\n${stderrStr}`);
    }
    return null;
  }
}