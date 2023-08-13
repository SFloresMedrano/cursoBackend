class LoggerController {
  async print(req, res) {
    req.logger.debug('Debug');
    req.logger.http('http');
    req.logger.info('http');
    req.logger.warn('Alerta');
    req.logger.error('error');
    req.logger.error('fatal');
    req.send({ message: 'Prueba de Winston' });
  }
}

export const loggerController = new LoggerController();
