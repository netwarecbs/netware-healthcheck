import { MongoClientOptions } from "mongodb";
import { Handler } from 'express';

export interface ProviderResponse {
    alive: boolean;
    healthy: boolean;
    response: object;
}

/** Interface for implementing health check providers */
export interface BaseHealthProvider {
    constructor(id: string, name: string, tags: string[]);
    check(): Promise<ProviderResponse>;
}

/** Configuration for MongoDb connection */
interface MongoDbNativeHealthProviderConfiguration {
    uri: string;
    options: MongoClientOptions;
}

/** MongoDb health check provider */
export interface MongoDBNativeHealthProvider extends BaseHealthProvider {
    constructor(label: string, config: MongoDbNativeHealthProviderConfiguration);
}

interface RedisCacheHealthProviderConfiguration {
    name: string,
    port: number,
    host: string,
    password: string,
    memoryThreshold: number
}

/** Redis health check provider */
export interface RedisCacheHealthProvider extends BaseHealthProvider {
    constructor(label: string, config: RedisCacheHealthProviderConfiguration);
}

interface HealthCheckHandlerOptions {
    timeout: number,
    usage: boolean,
    log: {
        logToConsole: boolean,
        logToFile: boolean,
        fileLocation: string
    }
}

/** Service health check provider */
export interface ServiceHealthProvider extends BaseHealthProvider {
    constructor(label: string, url: string, method: string);
}

export default function (options: HealthCheckHandlerOptions, providers: BaseHealthProvider[]): Handler[]; 