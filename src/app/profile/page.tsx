
'use client';

import { useAuth, type SupabaseUser } from '@/contexts/supabase-auth-context'; // Updated import
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, LogOut, UserCircle, Languages, TrendingUp, CalendarDays, BarChart3, Star, ClipboardCheck, Camera, ImagePlus, Palette, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading, logOut, updateUserDisplayName, updateUserProfilePhoto } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.display_name) {
      setNewDisplayName(user.user_metadata.display_name);
    } else if (user?.email) {
      setNewDisplayName(user.email.split('@')[0]);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (selectedFile && user && previewImage) {
      // In a real app, upload selectedFile to Supabase Storage, get the public URL,
      // then call updateUserProfilePhoto(storageURL)
      // For Supabase, the photoURL is often managed via user_metadata.avatar_url
      // or directly if using a standard OAuth provider field.
      // This function currently just updates metadata if you provide a direct URL.
      toast({
        title: "Demo Feature",
        description: "Photo upload to Supabase Storage not implemented yet. This is a placeholder.",
      });
      // Example: await updateUserProfilePhoto(previewImage); // If previewImage was a direct URL
      console.log("Attempting to 'upload' (placeholder):", selectedFile.name);
      setSelectedFile(null);
      // setPreviewImage(null); // Keep preview until successful actual upload
    }
  };
  
  const handleSaveDisplayName = async () => {
    if (user && newDisplayName.trim() && newDisplayName.trim() !== (user.user_metadata?.display_name || user.email?.split('@')[0])) {
      await updateUserDisplayName(newDisplayName.trim());
      setIsEditingName(false);
    } else {
      setIsEditingName(false); // Just close if no change or empty
    }
  };


  const handleSelectPredefinedAvatar = async (avatarUrl: string) => {
     if (user) {
      await updateUserProfilePhoto(avatarUrl); // This will update user_metadata.avatar_url
      setPreviewImage(null); // Clear local file preview if any
     }
  }

  const predefinedAvatars = [
    { id: 'avatar1', url: 'https://placehold.co/96x96/E91E63/FFFFFF.png?text=P1', name: 'Pink P1' },
    { id: 'avatar2', url: 'https://placehold.co/96x96/2196F3/FFFFFF.png?text=P2', name: 'Blue P2' },
    { id: 'avatar3', url: 'https://placehold.co/96x96/4CAF50/FFFFFF.png?text=P3', name: 'Green P3' },
  ];

  const handleShareApp = async () => {
    const shareData = {
      title: "Let's Learn Ol Chiki",
      text: "Check out this app to learn the Ol Chiki script for the Santali language!",
      url: window.location.origin,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({ title: "Thanks for sharing!", description: "App link shared successfully." });
      } else {
        navigator.clipboard.writeText(shareData.url).then(() => {
          toast({ title: "Link Copied!", description: "App link copied to clipboard. You can paste it to share."});
        }).catch(err => {
          console.error('Could not copy text: ', err);
          toast({ title: "Share Error", description: "Could not copy link. Please share the URL manually.", variant: "destructive"});
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({ title: "Share Error", description: "There was an error trying to share the app.", variant: "destructive"});
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const userPhoto = previewImage || user?.user_metadata?.avatar_url || user?.user_metadata?.picture; // Supabase uses avatar_url or picture from OAuth

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 pt-10 md:p-8">
      <div className="mb-6 flex justify-start">
        <Button variant="outline" onClick={() => router.push('/')}>
          &larr; Back to App
        </Button>
      </div>

      {!user ? (
        <Card className="mx-auto w-full max-w-2xl shadow-xl mb-8 text-center">
          <CardHeader className="p-6 sm:p-8">
            <Languages className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">Let's Learn Ol Chiki</CardTitle>
            <CardDescription className="mt-2 text-md">
              Your Learning Journey Awaits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
            <p className="text-muted-foreground mb-6">
              Log in or sign up to save your progress, view statistics, and track your learning.
            </p>
            <Button onClick={() => router.push('/auth')} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login / Sign Up
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mx-auto w-full max-w-2xl shadow-xl mb-8">
          <CardHeader className="items-center text-center">
            <div className="relative mb-4">
              {userPhoto ? (
                <Image
                  src={userPhoto}
                  alt={user.user_metadata?.display_name || 'User Profile Picture'}
                  width={96}
                  height={96}
                  className="mx-auto h-24 w-24 rounded-full border-2 border-primary object-cover shadow-sm"
                  unoptimized={userPhoto.startsWith('blob:')} // Next.js Image might need this for blob URLs
                />
              ) : (
                <UserCircle className="mx-auto h-24 w-24 text-primary" />
              )}
               <label htmlFor="photoUpload" className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:bg-primary/90">
                <Camera className="h-4 w-4" />
                <Input id="photoUpload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
            </div>

            {isEditingName ? (
              <div className="flex items-center space-x-2 mt-2">
                <Input 
                  value={newDisplayName} 
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="text-center text-2xl font-bold"
                  autoFocus
                />
                <Button onClick={handleSaveDisplayName} size="sm">Save</Button>
                <Button onClick={() => { setIsEditingName(false); setNewDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || '');}} variant="ghost" size="sm">Cancel</Button>
              </div>
            ) : (
              <CardTitle className="mt-2 text-3xl font-bold cursor-pointer hover:text-primary/80" onClick={() => setIsEditingName(true)}>
                {user.user_metadata?.display_name || user.email?.split('@')[0] || 'Your Profile'}
              </CardTitle>
            )}
            <CardDescription className="text-md mt-1 text-muted-foreground">
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pt-2">
            {selectedFile && (
                <div className="mt-4 mb-2 text-center">
                  <Button onClick={handleUploadPhoto} size="sm">
                    <ImagePlus className="mr-2 h-4 w-4" /> Upload Selected Photo
                  </Button>
                   <p className="text-xs text-muted-foreground mt-1">Photo upload is a demo.</p>
                </div>
            )}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 text-center">Choose an Avatar</h3>
              <div className="flex justify-center space-x-2">
                {predefinedAvatars.map(avatar => (
                  <Button key={avatar.id} variant="outline" size="icon" className="h-12 w-12 rounded-full p-0" onClick={() => handleSelectPredefinedAvatar(avatar.url)} title={`Select ${avatar.name}`}>
                    <Image src={avatar.url} alt={avatar.name} width={48} height={48} className="rounded-full object-cover"/>
                  </Button>
                ))}
                 <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => toast({title: "Coming Soon!", description: "More avatars will be available in a future update."})} title="More Avatars">
                    <Palette className="h-6 w-6"/>
                  </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Avatar selection (placeholder).</p>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6 mt-4">
            <Button onClick={logOut} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      )}

      <h2 className="text-2xl font-semibold text-center text-primary my-6">
        {user ? "Your Learning Dashboard" : "Learning Dashboard"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
        <Card className={`bg-card/80 backdrop-blur-sm ${!user ? 'opacity-70' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <div data-ai-hint="user activity" className="text-2xl font-bold">0 Days</div>
                <p className="text-xs text-muted-foreground">Keep learning daily!</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                <p className="text-xs text-muted-foreground">Log in to track your streak.</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className={`bg-card/80 backdrop-blur-sm ${!user ? 'opacity-70' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {user ? (
               <>
                <div data-ai-hint="statistics chart" className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">Detailed stats are on the way.</p>
               </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                <p className="text-xs text-muted-foreground">Log in to see performance.</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className={`bg-card/80 backdrop-blur-sm ${!user ? 'opacity-70' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranking</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <div data-ai-hint="leaderboard medal" className="text-2xl font-bold">View Rank</div>
                <p className="text-xs text-muted-foreground">Leaderboard coming soon!</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                <p className="text-xs text-muted-foreground">Log in for ranking details.</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className={`bg-card/80 backdrop-blur-sm ${!user ? 'opacity-70' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Results</CardTitle>
            <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {user ? (
               <>
                <div data-ai-hint="quiz results" className="text-2xl font-bold">Quiz Scores</div>
                <p className="text-xs text-muted-foreground">Track your results here soon.</p>
               </>
            ) : (
               <>
                <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                <p className="text-xs text-muted-foreground">Log in to view test results.</p>
               </>
            )}
          </CardContent>
        </Card>
      </div>
       <div className="text-center mt-8 max-w-2xl mx-auto">
         <p className="text-muted-foreground text-sm mb-6">
           {user ? "More dashboard features and profile customization coming soon!" : "Log in to unlock these features and track your progress."}
         </p>
         <Button onClick={handleShareApp} variant="default" className="w-full sm:w-auto">
            <Share2 className="mr-2 h-4 w-4" />
            Share this App with Friends
         </Button>
      </div>
    </div>
  );
}
