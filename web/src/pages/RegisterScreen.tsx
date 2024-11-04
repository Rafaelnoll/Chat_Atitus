import { useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Label } from "../components/label";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function RegisterScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();
      const userToken = data.token;
      localStorage.setItem("user-token", userToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Registrar-se
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="name"
              placeholder="Fulano Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirmar Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleRegister}
          >
            <LogIn className="mr-2 h-4 w-4" /> Criar Conta
          </Button>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Fazer Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
