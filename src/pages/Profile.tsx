
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Pencil, LogOut, Book, Award, 
  Briefcase, Settings, Moon, 
  Gamepad
} from "lucide-react";
import VoiceNavigation from "@/components/VoiceNavigation";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const { user, logout, updateUserProfile } = useUser();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme === 'dark';
  
  const [coursesInProgress, setCoursesInProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);
  const [achievementsCount, setAchievementsCount] = useState(1);
  
  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);
  
  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      // Get all user progress records
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      if (data) {
        // Count courses in progress
        const inProgress = data.filter(p => p.progress > 0 && p.progress < 100).length;
        setCoursesInProgress(inProgress);
        
        // Count completed courses
        const completed = data.filter(p => p.completed).length;
        setCompletedCourses(completed);
        
        // Calculate average progress
        if (data.length > 0) {
          const totalProgress = data.reduce((sum, record) => sum + record.progress, 0);
          setAverageProgress(Math.round(totalProgress / data.length));
        }
        
        // Calculate achievements (simplified version)
        setAchievementsCount(completed > 0 ? completed + 1 : 1);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    navigate("/login");
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast({
      title: `${!isDarkMode ? "Dark" : "Light"} mode activated`,
      description: `The app theme has been changed to ${!isDarkMode ? "dark" : "light"} mode.`
    });
  };

  const navigateToGames = () => {
    navigate("/games");
  };

  return (
    <div className="container px-4 py-6">
      <VoiceNavigation />
      
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Card className="p-6 mb-8">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl">
              {user?.name?.[0] || "U"}
            </div>
            <button className="absolute bottom-0 right-0 bg-muted rounded-full p-1 border border-border">
              <Pencil size={14} />
            </button>
          </div>
          
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Learning Language</p>
              <p className="text-sm text-muted-foreground">{user?.preferredLanguage}</p>
            </div>
            <Button variant="ghost" size="sm">Change</Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Notification Settings</p>
              <p className="text-sm text-muted-foreground">Course reminders, updates</p>
            </div>
            <Button variant="ghost" size="sm">Manage</Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">App Theme</p>
              <p className="text-sm text-muted-foreground">{isDarkMode ? "Dark" : "Light"} mode</p>
            </div>
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
              className="ml-2"
            />
          </div>
        </div>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
      
      <Card className="p-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4">
            <div className="bg-secondary/50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
              <Book size={24} className="text-primary" />
            </div>
            <p className="text-2xl font-semibold">{coursesInProgress}</p>
            <p className="text-sm text-muted-foreground">Courses in Progress</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-secondary/50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
              <Award size={24} className="text-primary" />
            </div>
            <p className="text-2xl font-semibold">{achievementsCount}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
        </div>
        
        {coursesInProgress > 0 && (
          <div className="mt-4 px-2">
            <p className="text-sm font-medium mb-2">Overall Progress</p>
            <Progress value={averageProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">{averageProgress}% Complete</p>
          </div>
        )}
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
      
      <Card className="mb-8">
        <Button variant="ghost" className="w-full justify-start p-4 h-auto" onClick={navigateToGames}>
          <div className="flex items-center gap-3">
            <div className="bg-secondary/50 rounded-full p-2">
              <Gamepad size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Interactive Games & Quizzes</p>
              <p className="text-sm text-muted-foreground">Learn while having fun</p>
            </div>
          </div>
        </Button>
        
        <Separator />
        
        <Button variant="ghost" className="w-full justify-start p-4 h-auto">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/50 rounded-full p-2">
              <Briefcase size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Job Opportunities</p>
              <p className="text-sm text-muted-foreground">Browse jobs matching your skills</p>
            </div>
          </div>
        </Button>
        
        <Separator />
        
        <Button variant="ghost" className="w-full justify-start p-4 h-auto">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/50 rounded-full p-2">
              <Settings size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Skill Assessment</p>
              <p className="text-sm text-muted-foreground">Test your skills and get recommendations</p>
            </div>
          </div>
        </Button>
      </Card>
      
      <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
        <LogOut size={16} />
        Sign Out
      </Button>
      
      <p className="text-center text-xs text-muted-foreground mt-8">
        HerVoice v1.0 - Powered by Slytherin<br/>
        <span className="text-primary">Women Safety Helpline: 1800-1090</span>
      </p>
    </div>
  );
};

export default Profile;
