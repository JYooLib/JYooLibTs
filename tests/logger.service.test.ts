import { JYLib_LoggerService, LOG_DEBUG, LOG_ERROR, LOG_INFO, LOG_VERBOSE, LOG_WARN } from "../src/services/logger.service";

class TestObject {
  loggerService: JYLib_LoggerService;
}

test('logging to console', () => {
  const testObj = new TestObject();
  testObj.loggerService = new JYLib_LoggerService('test', 'debug');
  LOG_ERROR(testObj, "DEBUG Message!!");
  LOG_WARN(testObj, "WARN Message!!");
  LOG_INFO(testObj, "INFO Message!!");
  LOG_VERBOSE(testObj, "VERBOSE Message!!");
  LOG_DEBUG(testObj, "DEBUG Message!!");

  // Print with trace
  var err = new Error();
  testObj.loggerService.error("ERROR with trace", err.stack)
});