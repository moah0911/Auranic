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
          
          <Card className="border-2 border-purple-600/80 bg-gradient-to-br from-black via-purple-950/20 to-black/95 backdrop-blur-lg text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTM4LCA0MywgMjI2LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/0 via-purple-600 to-purple-600/0"></div>
            
            <CardHeader className="relative">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 bg-black/60 border border-purple-500/50 rounded-lg overflow-hidden">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600/50 data-[state=active]:to-purple-900/30 data-[state=active]:text-white text-gray-400 py-3 transition-all duration-300"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-600/50 data-[state=active]:to-purple-900/30 data-[state=active]:text-white text-gray-400 py-3 transition-all duration-300"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-4">
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 text-2xl font-bold tracking-wide">
                    Access Your Digital Aura
                  </CardTitle>
                  <CardDescription className="text-purple-200/70">
                    Enter your credentials to continue your mystical journey
                  </CardDescription>
                </TabsContent>
                
                <TabsContent value="register" className="mt-4">
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 text-2xl font-bold tracking-wide">
                    Create Your Energy Profile
                  </CardTitle>
                  <CardDescription className="text-purple-200/70">
                    Join the AURANIC community to discover hidden vibes
                  </CardDescription>
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
                          <FormLabel className="text-purple-300 font-medium">Username</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                placeholder="Enter your username" 
                                {...field} 
                                className="bg-black/40 border-purple-600/50 focus:border-purple-400 border-2 rounded-lg py-6 pl-4 pr-10 font-medium text-white/90 placeholder:text-gray-500 placeholder:font-normal transition-all duration-300 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-purple-800 focus-visible:ring-purple-400" 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                @
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300 font-medium">Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                {...field} 
                                className="bg-black/40 border-purple-600/50 focus:border-purple-400 border-2 rounded-lg py-6 pl-4 pr-10 font-medium text-white/90 placeholder:text-gray-500 placeholder:font-normal transition-all duration-300 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-purple-800 focus-visible:ring-purple-400" 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                🔒
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={loginMutation.isPending} 
                      className="w-full relative py-6 overflow-hidden group bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-medium rounded-lg text-lg shadow-lg shadow-purple-500/30 transition-all duration-300"
                    >
                      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></span>
                      <span className="relative flex items-center justify-center">
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                            <span className="animate-pulse">Accessing Mystic Portal...</span>
                          </>
                        ) : (
                          <>
                            <span className="mr-2">✨</span>
                            <span>Enter the Vibe</span>
                          </>
                        )}
                      </span>
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
                          <FormLabel className="text-purple-300 font-medium">Username</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                placeholder="Choose a username" 
                                {...field} 
                                className="bg-black/40 border-purple-600/50 focus:border-purple-400 border-2 rounded-lg py-6 pl-4 pr-10 font-medium text-white/90 placeholder:text-gray-500 placeholder:font-normal transition-all duration-300 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-purple-800 focus-visible:ring-purple-400" 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                @
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                {...field} 
                                className="bg-black/40 border-purple-600/50 focus:border-purple-400 border-2 rounded-lg py-6 pl-4 pr-10 font-medium text-white/90 placeholder:text-gray-500 placeholder:font-normal transition-all duration-300 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-purple-800 focus-visible:ring-purple-400" 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                ✉️
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300 font-medium">Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                type="password" 
                                placeholder="Create a password" 
                                {...field} 
                                className="bg-black/40 border-purple-600/50 focus:border-purple-400 border-2 rounded-lg py-6 pl-4 pr-10 font-medium text-white/90 placeholder:text-gray-500 placeholder:font-normal transition-all duration-300 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-purple-800 focus-visible:ring-purple-400" 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                🔒
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300 font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                type="password" 
                                placeholder="Confirm your password" 
                                {...field} 
                                className="bg-black/40 border-purple-600/50 focus:border-purple-400 border-2 rounded-lg py-6 pl-4 pr-10 font-medium text-white/90 placeholder:text-gray-500 placeholder:font-normal transition-all duration-300 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-purple-800 focus-visible:ring-purple-400" 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                ✅
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={registerMutation.isPending} 
                      className="w-full relative py-6 overflow-hidden group bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-medium rounded-lg text-lg shadow-lg shadow-purple-500/30 transition-all duration-300"
                    >
                      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></span>
                      <span className="relative flex items-center justify-center">
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                            <span className="animate-pulse">Creating Energy Profile...</span>
                          </>
                        ) : (
                          <>
                            <span className="mr-2">🔮</span>
                            <span>Join the Vibe</span>
                          </>
                        )}
                      </span>
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