import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-primary text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Olimpíadas</h1>
                <p className="text-xs text-gray-400">Portugal</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Uma iniciativa para democratizar o acesso à IA para estudantes de todas as áreas acadêmicas em Portugal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/learning-paths">
                  <a className="text-gray-400 hover:text-white transition">Caminhos de Aprendizagem</a>
                </Link>
              </li>
              <li>
                <Link href="/challenges">
                  <a className="text-gray-400 hover:text-white transition">Desafios Semanais</a>
                </Link>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Biblioteca de Datasets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Tutoriais e Guias</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Documentação da API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Comunidade</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Fórum de Discussão</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Grupos de Estudo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Eventos e Webinars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Programa de Mentoria</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Histórias de Sucesso</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Sobre as Olimpíadas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Parceiros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Equipe</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contato</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Imprensa</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} IA Olimpíadas Nacionais. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Termos de Uso</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Política de Privacidade</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
