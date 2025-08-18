import { appendFile } from 'fs';
import { parse, stringify } from 'flatted';
import * as moment from 'moment';

export default function useLog<T = any>(data: T) {
  const date = moment().format('YYYY_MM_DD');
  const filename = `logs/error_${date}.log`;
  const log = stringify(data);
  const time = moment().format('YYYY-MM-DD HH:mm:ss');
  appendFile(
    filename,
    `[${time}] ${process.env.NODE_ENV}.critical: ${log}\n\n`,
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}
