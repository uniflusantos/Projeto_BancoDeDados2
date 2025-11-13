"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggler } from "@/components/animate-ui/primitives/effects/theme-toggler";
import { Sun, Moon, CircleDollarSign } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { getItemCount } = useCart();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const cartCount = getItemCount();

  const getNextTheme = (current: string): "light" | "dark" | "system" => {
    // If current is 'system', toggle based on resolved theme
    if (current === "system") {
      return resolvedTheme === "light" ? "dark" : "light";
    }
    // Otherwise toggle between light and dark
    return current === "light" ? "dark" : "light";
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-xl font-semibold text-foreground"
            >
              <CircleDollarSign className="size-6" />
              <span className="ml-2">E-commerce</span>
            </Link>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  Produtos
                </Link>
                {user && (
                  <>
                    <Link
                      href="/products/new"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Adicionar Produto
                    </Link>
                    <Link
                      href="/cart"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Carrinho
                      {cartCount > 0 && (
                        <Badge variant="default" className="ml-2">
                          {cartCount}
                        </Badge>
                      )}
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Perfil
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-muted-foreground">Carregando...</div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <ThemeToggler
                  theme={theme}
                  resolvedTheme={resolvedTheme}
                  setTheme={setTheme}
                >
                  {({ effective, toggleTheme }) => (
                    <button
                      onClick={() => toggleTheme(getNextTheme(effective))}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label="Toggle theme"
                    >
                      {effective === "dark" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </ThemeToggler>
                <span className="text-sm text-muted-foreground">
                  {user.username}
                </span>
                <Button onClick={handleLogout} variant="default">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ThemeToggler
                  theme={theme}
                  resolvedTheme={resolvedTheme}
                  setTheme={setTheme}
                >
                  {({ effective, toggleTheme }) => (
                    <button
                      onClick={() => toggleTheme(getNextTheme(effective))}
                      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label="Toggle theme"
                    >
                      {effective === "dark" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </ThemeToggler>
                {/* <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/register">Register</Link>
                </Button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
