import { JYLib_Timer } from '../src/utils/timer.util';

describe('JYLib_Timer', () => {
  jest.useFakeTimers();

  let callback: jest.Mock;
  let timer: JYLib_Timer;

  beforeEach(() => {
    callback = jest.fn();
    timer = new JYLib_Timer(callback);
  });

  afterEach(() => {
    timer.stop();
  });

  it('should call the callback after the specified interval', () => {
    timer.start(1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the callback immediately if runCbFirst is true', () => {
    timer.start(1000, true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should stop the timer', () => {
    timer.start(1000);
    timer.stop();
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should restart the timer after callback execution', () => {
    timer.start(1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should expire the timer immediately', () => {
    timer.start(1000);
    timer.expire();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should expire the timer after the specified duration', () => {
    timer.start(1000);
    timer.expire(500);
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should return true if the timer is stopped', () => {
    expect(timer.isStopped()).toBe(true);
    timer.start(1000);
    expect(timer.isStopped()).toBe(false);
    timer.stop();
    expect(timer.isStopped()).toBe(true);
  });

  it('should sleep for the specified duration', async () => {
    const sleepSpy = jest.spyOn(global, 'setTimeout');
    await JYLib_Timer.sleep(1000);
    expect(sleepSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
  });
});