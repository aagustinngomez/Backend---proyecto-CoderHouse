import winston from "winston";
import config from "../config/config.js";

<<<<<<< HEAD
const { LOG_LEVEL_CONSOLE, LOG_LEVEL_FILE, NODE_ENV } = config;
=======
const { LOG_LEVEL_CONSOLE, LOG_LEVEL_FILE } = config;
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "brightRed",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

winston.addColors(customLevelsOptions.colors);

const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL_CONSOLE,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
<<<<<<< HEAD
  ],
});

if (NODE_ENV === "produccion") {
  logger.transports.push(new winston.transports.File({ filename: "./errors.log", level: LOG_LEVEL_FILE }));
}

=======
    new winston.transports.File({ filename: "./errors.log", level: LOG_LEVEL_FILE }),
  ],
});

>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

export const getLogger = () => {
  return logger;
};