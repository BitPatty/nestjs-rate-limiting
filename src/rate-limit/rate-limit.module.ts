import { Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { RateLimitController } from './rate-limit.controller';
import { RateLimiterOptions } from 'nestjs-rate-limiter';

@Module({
  imports: [],
  providers: [
    {
      // The RATE_LIMITER_OPTIONS is a global configuration
      // used internally by the nestjs-rate-limiter library
      provide: 'RATE_LIMITER_OPTIONS',
      useFactory: async (): Promise<RateLimiterOptions> => {
        // At this point we connect the application to the mongo database
        // which stores the current state of the rate limits
        const mongoClient = new MongoClient(process.env.MONGO_DATABASE_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        await mongoClient.connect();

        // The connected client as well as the configuration
        // For the rate limiter is returned by the factory
        return {
          type: 'Mongo',
          dbName: process.env.MONGO_DATABASE_NAME,
          storeClient: mongoClient,
          errorMessage: 'RATE LIMITED',
        };
      },
    },
  ],
  controllers: [RateLimitController],
  exports: ['RATE_LIMITER_OPTIONS'],
})
export class RateLimitModule {}
