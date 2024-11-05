import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full max-w-md p-8 text-center">
        <h1 className="text-9xl font-thin text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-light text-gray-700 dark:text-gray-300 mb-8">
          Página não encontrada
        </h2>
        <Button
          onClick={handleRedirect}
          className="group bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-normal py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md transition-all duration-300"
        >
          Voltar
          <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
