import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RateLimit, RateLimiterInterceptor } from 'nestjs-rate-limiter';

// Use the Interceptor to inject the actual rate limiting
@UseInterceptors(RateLimiterInterceptor)
@Controller('/rate-limit')
export class RateLimitController {
  // Use the RateLimit decorator on the endpoints/methods
  // You want to be rate limited. You can use the key-prefix
  // To group and/or seperate requests
  @RateLimit({
    keyPrefix: 'call_rate_limit',

    // The points specifies how many requests
    // a client can make
    points: 5,

    // The duration specifies the timespan in
    // which the client is allowed to make these requests
    duration: 600,
  })
  @Get()
  async get(): Promise<boolean> {
    return true;
  }
}
