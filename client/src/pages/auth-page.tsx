import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { insertUserSchema } from "@shared/schema";
import { getRandomGlitchBackground, getRandomNeonTexture } from "@/lib/utils";

// Create schema for login
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Create schema for registration by extending the insertUserSchema
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // For login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // For registration form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    // Omit confirmPassword as it's not in InsertUser type
    const { confirmPassword, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };

  // If user is already logged in, redirect to home page
  if (user) {
    return <Redirect to="/" />;
  }

  // Random background for aesthetics
  const glitchBg = getRandomGlitchBackground();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-center bg-black">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-purple-400 mb-2">AURANIC</h1>
            <p className="text-muted-foreground text-gray-400">Discover your digital aura & rizz</p>
          </div>
          
          <Card className="border-purple-700 bg-black/50 backdrop-blur-lg text-white">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 bg-black/60">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-4">
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription className="text-gray-400">Enter your credentials to continue your mystical journey</CardDescription>
                </TabsContent>
                
                <TabsContent value="register" className="mt-4">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription className="text-gray-400">Join the AURANIC community to discover hidden energies</CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              {activeTab === "login" ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} className="bg-black/60 border-purple-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} className="bg-black/60 border-purple-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={loginMutation.isPending} 
                      className="w-full bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700"
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} className="bg-black/60 border-purple-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} className="bg-black/60 border-purple-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} className="bg-black/60 border-purple-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} className="bg-black/60 border-purple-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={registerMutation.isPending} 
                      className="w-full bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => {
                  setActiveTab(activeTab === "login" ? "register" : "login");
                }}
                className="text-purple-400"
              >
                {activeTab === "login" ? "Need an account? Register" : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Hero Image Section */}
      <div 
        className="w-full md:w-1/2 bg-cover bg-center min-h-[400px] md:min-h-screen relative overflow-hidden"
        style={{ backgroundImage: `url(${typeof glitchBg === 'string' ? glitchBg : glitchBg.url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center p-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white tracking-wide">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Mystical</span> Essence
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 max-w-lg mb-6">
            AURANIC reveals the hidden energy signature of faces, portraits, and Ghibli characters through advanced aura reading.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md w-full">
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-purple-700">
              <h3 className="text-xl font-bold text-purple-400">Aura Score</h3>
              <p className="text-gray-300">Reveals your inner spirit energy and emotional resonance</p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-pink-700">
              <h3 className="text-xl font-bold text-pink-400">Rizz Score</h3>
              <p className="text-gray-300">Measures your charisma, allure and social magnetic presence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}