import Joi from "joi";
import fs from "fs/promises";
import { validateType } from "../data/datatools.js";
import { IServiceTaskLogger } from "./servicetaskenvironment.js";
import { BpmnError, ErrorCode } from "../instance/bpmnerror.js";

export interface IServiceConfigSecret {
  secret: { [key: string]: string };
}

const IServiceConfigObject: IServiceConfigSecret = {
  secret: Joi.object().pattern(Joi.string(), Joi.string()) as unknown as { [key: string]: string },
};

export const IServiceConfigSchema = Joi.object(IServiceConfigObject);

/**
 * Reads the config file of a service
 * @param configPath path to config.json
 * @param schema Joi schema to validate config file
 * @param logger logger from service task environment
 * @returns the config from the file or undefined, if the file was not found. If the data could not be read or joi validation failed, a BpmnError is thrown.
 */
export async function readConfigFile<T = IServiceConfigSecret>(
  configPath: string,
  schema: Joi.Schema<T> = IServiceConfigSchema,
  logger: IServiceTaskLogger,
): Promise<T | undefined> {
  try {
    const configData = await fs.readFile(configPath, "utf8");
    const config = validateType<T>(schema, JSON.parse(configData));
    return config;
  } catch (ex) {
    if ((ex as NodeJS.ErrnoException)?.code === "ENOENT") {
      // Config file does not exist - use empty secrets
      logger.info(`Could not read service config: Config file ${configPath} does not exist.`);
      return undefined;
    } else {
      logger.error("Failed to load service config file: " + String(ex));
      throw new BpmnError(ErrorCode.ConfigInvalid, "Could not load config file " + configPath, ex instanceof Error ? ex : undefined);
    }
  }
}
