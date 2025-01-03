import { JYLib_NestJsLoggerService, LOG_DEBUG, LOG_ERROR, LOG_INFO, LOG_VERBOSE, LOG_WARN } from "../src/services/nestjs-logger.service";

class TestObject {
  loggerService: JYLib_NestJsLoggerService;
}

test('logging to console', () => {
  const testObj = new TestObject();
  testObj.loggerService = new JYLib_NestJsLoggerService('test', 'debug', './tests/logs', 30);
  LOG_ERROR(testObj, "DEBUG Message!!");
  LOG_WARN(testObj, "WARN Message!!");
  LOG_INFO(testObj, "INFO Message!!");
  LOG_VERBOSE(testObj, "VERBOSE Message!!");
  LOG_DEBUG(testObj, "DEBUG Message!!");

  // Print with trace
  var err = new Error();
  testObj.loggerService.error("ERROR with trace", err.stack)
});