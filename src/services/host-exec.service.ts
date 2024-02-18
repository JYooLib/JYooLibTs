import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { LogService } from '../log_service/log.service';

@Injectable()
export class HostExecService {
  constructor(private logService: LogService) {
    this.logService.setLabel('HostExecService');
  }

  async execute(cmdStr: string, runAsSudo: boolean = false): Promise<any> {
    if (runAsSudo) {
      cmdStr = `"echo ${process.env.HOST_USER_PWD} | sudo -S ${cmdStr}"`;
    }

    const cmd = `sshpass -p '${process.env.HOST_USER_PWD}' ssh -q -o StrictHostKeyChecking=no ${process.env.HOST_USER_ID}@${process.env.DOCKER_HOST_IP} ${cmdStr}`;
    this.logService.log(`execute(): cmd=${cmd.replace(process.env.HOST_USER_PWD, '****')}`);

    let stdoutStr = '', stderrStr = '';
    try {
      const { err, stdout, stderr } = await new Promise(
        (resolve, reject) => {
          exec(cmd, (err, stdout, stderr) => {
            stdoutStr = stdout.toString();
            stderrStr = stderr.toString();
            //this.logService.log(`stdout: ${stdout}`);
            if (err) {
              reject({ err, stdout, stderr});
            }
            if (stderr) {
              if (err != undefined) {
                //this.logService.log(`stderr: ${stderr}`);
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

      this.logService.error('execute(): cmd error:');
      //this.logService.error(e);

      if (e.err != undefined) {
        e.errStr = JSON.stringify(e.err, Object.getOwnPropertyNames(e.err));
      } else {
        e.errStr = 'Unknown Error';
      }
      e.errStr = e.errStr.replace(/\\n/g, '\n').replace(process.env.HOST_USER_PWD, '****');
      this.logService.error(e.errStr);
      return e;
    }
    this.logService.log(`<stdout>=\n${stdoutStr}`);
    if (stderrStr != '') {
      this.logService.log('');
      this.logService.log(`<stderr>=\n${stderrStr}`);
    }
    return null;
  }
}