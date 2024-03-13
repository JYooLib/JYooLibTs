import { JYLib_LoggerService } from "../src/services/logger.service";

test('logging', () => {
	const logger = new JYLib_LoggerService('test', 'debug');
  logger.debug("hello");
  expect(logger).toBeInstanceOf(JYLib_LoggerService);
});