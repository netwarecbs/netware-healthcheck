import DailyRotateFileTransport from 'winston-daily-rotate-file';
import { isNullOrUndefined } from 'util';
import path from 'path';
import { UP } from './constants/healthStatuses';
import winston from 'winston';

const {
    createLogger,
    transports: { Console },
    format: { combine, timestamp, printf }
} = winston;

export default function HealthCheckLogger(options) {
    const { logToConsole, logToFile, fileLocation } = options.log;
    const applicationLabel = `${options.name}@${options.version}`;

    const logger = createLogger({ level: 'info', json: false });
    logger.clear();

    const resultFormatter = printf(({ level, message }) => {
        if (message.status === UP) {
            const hasSubSystemData = (message.results && (message.results.length > 0)),
                health = isNullOrUndefined(message.healthy) ? 'no-data' : (message.healthy ? 'Ok' : 'Sick'),
                healthySubSystems = hasSubSystemData && message.results
                    .filter(({ response: { alive, healthy } }) => alive && healthy),
                deadSubSystems = hasSubSystemData && message.results
                    .filter(({ response: { alive } }) => !alive),
                sickSubSystems = hasSubSystemData && message.results
                    .filter(({ response: { alive, healthy } }) => alive && !healthy),
                getSubsystems = list => list ?
                    ((list.length > 0) ? list.map(({ label }) => label) : 'none') : 'no-data';

            return `${applicationLabel}:${level}: Status: ${message.status}/${health}; Healthy: ${getSubsystems(healthySubSystems)}; Dead: ${getSubsystems(deadSubSystems)}; Sick: ${getSubsystems(sickSubSystems)};`;
        } else {
            return `${applicationLabel}:${level}: Status: ${message.status}, Healthy: ${message.healthy}, Response: ${message.response}`;
        }
    });

    if (logToConsole === true) {
        logger.add(new Console({
            format: combine(timestamp(), resultFormatter)
        }));
    }

    if (logToFile === true) {
        logger.add(new DailyRotateFileTransport({
            filename: path.join(fileLocation, './health-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            format: combine(timestamp(), resultFormatter)
        }));
    }

    //logger.handleExceptions(transports);

    logger.stream = {
        write(message) {
            logger.info(message.trim());
        }
    };

    return function (req, res, next) {
        logger.info(req._healthCheckResult);
        next();
    };
}