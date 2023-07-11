import { autores, livros } from '../models/index.js';

class LivroController {
  static listarLivros = async (req, res, next) => {
    try {
      const buscaLivros = livros.find();
      req.resultado = buscaLivros;
      next();
    } catch (err) {
      next(err);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id);

      res.status(200).send(livroResultados);
    } catch (err) {
      next(err);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (err) {
      next(err);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndUpdate(id, { $set: req.body });

      res.status(200).send({ message: 'Livro atualizado com sucesso' });
    } catch (err) {
      next(err);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndDelete(id);

      res.status(200).send({ message: 'Livro removido com sucesso' });
    } catch (err) {
      next(err);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = livros
          .find(busca);
        req.resultado = livrosResultado;
        next();
      } else {
        res.status(200).send([]);
      }

    } catch (err) {
      next(err);
    }
  };
}

async function processaBusca(props) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = props;

  let busca = {};

  if (editora) busca.editora = editora;
  if (titulo) busca.titulo = { $regex: titulo, $options: 'i' };

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};

  //gte = Greater Than or Equal
  if (minPaginas) busca.numeroPaginas.$gte = minPaginas;

  //lte = Lower Than or Equal
  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }

  }

  return busca;
}

export default LivroController;