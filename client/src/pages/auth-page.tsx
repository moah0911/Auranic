import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUserAstronaut, FaLock, FaEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { Loader2 } from "lucide-react";
import { insertUserSchema } from "@shared/schema";
import { getRandomGlitchBackground } from "@/lib/utils";
import { glitchText, scannerAnimation } from "@/lib/animations";

// Create schema for login
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Extend registration schema for the form
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const glitchBg = getRandomGlitchBackground();
  
  useEffect(() => {
    // Preload background image
    const img = new Image();
    img.src = glitchBg;
    img.onload = () => setBgImageLoaded(true);
  }, [glitchBg]);

  // Create form for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Create form for registration
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  // Handle login submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  // Handle registration submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a] overflow-hidden">
      {/* Animated background effect */}
      <motion.div 
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        style={{
          background: "radial-gradient(circle at center, rgba(176, 38, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 238, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 238, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Authentication Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-12 relative z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Auth Card */}
          <div className="w-full rounded-xl overflow-hidden backdrop-blur-md border-2 border-[#b026ff] shadow-2xl relative">
            {/* Card header with tab navigation */}
            <div className="relative bg-black/60 p-6 flex flex-col items-center">
              {/* Glowing logo */}
              <motion.div 
                className="w-16 h-16 flex items-center justify-center mb-6 rounded-full bg-gradient-to-br from-[#b026ff] to-[#0ef] shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(176, 38, 255, 0.7)",
                    "0 0 20px rgba(176, 38, 255, 0.7)",
                    "0 0 10px rgba(176, 38, 255, 0.7)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <HiOutlineSparkles className="text-white text-2xl" />
              </motion.div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-['Orbitron']">AURANIC</h1>
              <p className="text-[#0ef] mb-4 text-sm tracking-wide">Digital Vibe Analyzer</p>
              
              {/* Tab Navigation */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <button 
                  onClick={() => setActiveTab("login")}
                  className={`py-3 text-center transition-all font-['Orbitron'] text-sm ${
                    activeTab === "login" 
                      ? "bg-gradient-to-r from-[#b026ff] to-[#0ef] text-white rounded-t-lg font-bold" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  LOGIN
                </button>
                <button 
                  onClick={() => setActiveTab("register")}
                  className={`py-3 text-center transition-all font-['Orbitron'] text-sm ${
                    activeTab === "register" 
                      ? "bg-gradient-to-r from-[#0ef] to-[#b026ff] text-white rounded-t-lg font-bold" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  REGISTER
                </button>
              </div>
            </div>
            
            {/* Scanner line effect */}
            <motion.div 
              className="h-1 bg-gradient-to-r from-transparent via-[#0ef] to-transparent"
              variants={scannerAnimation}
              initial="initial"
              animate="animate"
            ></motion.div>
            
            {/* Form Body */}
            <div className="bg-black/40 backdrop-blur-sm p-6 md:p-8">
              {/* Login Form */}
              {activeTab === "login" && (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="text-sm text-[#0ef] font-['Orbitron'] absolute -top-2 left-2 px-1 bg-black z-10">USERNAME</FormLabel>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-3 text-gray-500">
                                <FaUserAstronaut />
                              </span>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your username" 
                                  {...field} 
                                  className="pl-10 bg-black/60 border-[#b026ff]/50 focus:border-[#0ef] h-12 text-white rounded-lg"
                                />
                              </FormControl>
                            </div>
                          </div>
                          <FormMessage className="text-[#ff2d95] mt-1 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="text-sm text-[#0ef] font-['Orbitron'] absolute -top-2 left-2 px-1 bg-black z-10">PASSWORD</FormLabel>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-3 text-gray-500">
                                <FaLock />
                              </span>
                              <FormControl>
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password" 
                                  {...field} 
                                  className="pl-10 pr-10 bg-black/60 border-[#b026ff]/50 focus:border-[#0ef] h-12 text-white rounded-lg"
                                />
                              </FormControl>
                              <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-500 hover:text-[#0ef]"
                              >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>
                            </div>
                          </div>
                          <FormMessage className="text-[#ff2d95] mt-1 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={loginMutation.isPending} 
                      className="w-full relative py-6 overflow-hidden group bg-gradient-to-br from-[#0ef] to-[#b026ff] hover:from-[#0ef]/80 hover:to-[#b026ff]/80 text-white font-medium rounded-lg text-lg shadow-lg shadow-[#0ef]/30 transition-all duration-300"
                    >
                      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out"></span>
                      <span className="relative flex items-center justify-center">
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                            <span className="animate-pulse">Syncing Energy Grid...</span>
                          </>
                        ) : (
                          <>
                            <span className="mr-2">✨</span>
                            <span>Enter the Vibeverse</span>
                          </>
                        )}
                      </span>
                    </Button>
                  </form>
                </Form>
              )}
              
              {/* Register Form */}
              {activeTab === "register" && (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="text-sm text-[#0ef] font-['Orbitron'] absolute -top-2 left-2 px-1 bg-black z-10">USERNAME</FormLabel>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-3 text-gray-500">
                                <FaUserAstronaut />
                              </span>
                              <FormControl>
                                <Input 
                                  placeholder="Choose your digital identity" 
                                  {...field} 
                                  className="pl-10 bg-black/60 border-[#b026ff]/50 focus:border-[#0ef] h-12 text-white rounded-lg"
                                />
                              </FormControl>
                            </div>
                          </div>
                          <FormMessage className="text-[#ff2d95] mt-1 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="text-sm text-[#0ef] font-['Orbitron'] absolute -top-2 left-2 px-1 bg-black z-10">EMAIL</FormLabel>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-3 text-gray-500">
                                <FaEnvelope />
                              </span>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="Your cosmic email address" 
                                  {...field} 
                                  className="pl-10 bg-black/60 border-[#b026ff]/50 focus:border-[#0ef] h-12 text-white rounded-lg"
                                />
                              </FormControl>
                            </div>
                          </div>
                          <FormMessage className="text-[#ff2d95] mt-1 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="text-sm text-[#0ef] font-['Orbitron'] absolute -top-2 left-2 px-1 bg-black z-10">PASSWORD</FormLabel>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-3 text-gray-500">
                                <FaLock />
                              </span>
                              <FormControl>
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create your secure passkey" 
                                  {...field} 
                                  className="pl-10 pr-10 bg-black/60 border-[#b026ff]/50 focus:border-[#0ef] h-12 text-white rounded-lg"
                                />
                              </FormControl>
                              <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-500 hover:text-[#0ef]"
                              >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>
                            </div>
                          </div>
                          <FormMessage className="text-[#ff2d95] mt-1 text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                            <FormLabel className="text-sm text-[#0ef] font-['Orbitron'] absolute -top-2 left-2 px-1 bg-black z-10">CONFIRM</FormLabel>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-3 text-gray-500">
                                <FaLock />
                              </span>
                              <FormControl>
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Reconfirm your passkey" 
                                  {...field} 
                                  className="pl-10 pr-10 bg-black/60 border-[#b026ff]/50 focus:border-[#0ef] h-12 text-white rounded-lg"
                                />
                              </FormControl>
                              <button 
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-3 top-3 text-gray-500 hover:text-[#0ef]"
                              >
                                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>
                            </div>
                          </div>
                          <FormMessage className="text-[#ff2d95] mt-1 text-xs" />
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
              
              {/* Switch between login/register */}
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                  className="text-sm text-[#0ef]/80 hover:text-[#0ef] transition-colors"
                >
                  {activeTab === "login" ? "Need an account? Join the vibe realm" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Hero Section */}
      <div className="w-full md:w-1/2 relative overflow-hidden hidden md:block">
        {/* Background image with overlay */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${bgImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${glitchBg})` }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000] via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-12 z-10">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Discover Your <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ef] to-[#ff2d95]"
              variants={glitchText}
              initial="initial"
              animate="animate"
            >
              Digital Aura
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            AURANIC reveals the hidden energy signatures in your digital world through advanced AI vibe analysis.
          </motion.p>
          
          {/* Feature badges */}
          <motion.div 
            className="grid grid-cols-2 gap-5 w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-[#b026ff]/40 shadow-lg">
              <h3 className="text-xl font-bold text-[#0ef] mb-2">Aura Score</h3>
              <p className="text-gray-400">Reveals your inner energy and emotional resonance</p>
            </div>
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-[#ff2d95]/40 shadow-lg">
              <h3 className="text-xl font-bold text-[#ff2d95] mb-2">Rizz Score</h3>
              <p className="text-gray-400">Measures your charisma, allure and magnetic presence</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}