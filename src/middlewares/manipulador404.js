import NaoEncontrado from '../erros/NaoEncontrado.js';

export default function manipulador404(req, res, next) {
  const error404 = new NaoEncontrado();
  next(error404);
}