
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth, type SupabaseUser } from '@/contexts/supabase-auth-context';
import { useProfileActions } from '@/hooks/useProfileActions';
import { useFileUpload } from '@/hooks/useFileUpload';
import { predefinedAvatars } from '@/config/avatarConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCircle, Camera, ImagePlus, Palette, LogOut, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileCard: React.FC = () => {
  const { user, logOut } = useAuth();
  const { 
    isEditingName, 
    toggleEditingName, 
    handleSaveDisplayName, 
    handleSelectPredefinedAvatar,
    isLoading: isProfileUpdating 
  } = useProfileActions();
  const { selectedFile, previewImage, handleFileChange, handleUploadPhoto, clearSelection, isLoading: isFileUploading } = useFileUpload();
  const { toast } = useToast();
  
  const [currentDisplayName, setCurrentDisplayName] = useState('');

  useEffect(() => {
    if (user) {
      setCurrentDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'User');
    }
  }, [user]);

  if (!user) return null; // Should be caught by AuthGuard, but good practice

  const effectiveUserPhoto = previewImage || user.user_metadata?.avatar_url || user.user_metadata?.picture;

  const onSaveName = () => {
    handleSaveDisplayName(currentDisplayName);
  };

  const onCancelEditName = () => {
    setCurrentDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'User');
    toggleEditingName();
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl mb-8">
      <CardHeader className="items-center text-center p-6">
        <div className="relative mb-4">
          {effectiveUserPhoto ? (
            <Image
              src={effectiveUserPhoto}
              alt={currentDisplayName || 'User Profile Picture'}
              width={96}
              height={96}
              className="mx-auto h-24 w-24 rounded-full border-2 border-primary object-cover shadow-sm"
              unoptimized={effectiveUserPhoto.startsWith('blob:') || effectiveUserPhoto.startsWith('data:')}
              priority // Prioritize loading the user's profile picture
            />
          ) : (
            <UserCircle className="mx-auto h-24 w-24 text-primary" />
          )}
          <label htmlFor="photoUpload" className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:bg-primary/90">
            <Camera className="h-4 w-4" />
            <Input id="photoUpload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isFileUploading || isProfileUpdating} />
          </label>
        </div>

        {isEditingName ? (
          <div className="flex items-center space-x-2 mt-2 w-full max-w-sm mx-auto">
            <Input 
              value={currentDisplayName} 
              onChange={(e) => setCurrentDisplayName(e.target.value)}
              className="text-center text-2xl font-bold flex-grow"
              autoFocus
              disabled={isProfileUpdating}
            />
            <Button onClick={onSaveName} size="sm" disabled={isProfileUpdating}>Save</Button>
            <Button onClick={onCancelEditName} variant="ghost" size="sm" disabled={isProfileUpdating}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="mt-2 text-3xl font-bold">
              {user.user_metadata?.display_name || user.email?.split('@')[0] || 'Your Profile'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleEditingName} className="mt-2" aria-label="Edit display name">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        )}
        <CardDescription className="text-md mt-1 text-muted-foreground">
          {user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-2">
        {selectedFile && previewImage && (
            <div className="mt-4 mb-2 text-center space-y-2">
              <Button onClick={handleUploadPhoto} size="sm" disabled={isFileUploading || isProfileUpdating}>
                <ImagePlus className="mr-2 h-4 w-4" /> 
                {isFileUploading ? "Uploading..." : "Upload Selected Photo"}
              </Button>
              <Button onClick={clearSelection} variant="outline" size="sm" disabled={isFileUploading || isProfileUpdating}>
                 Cancel Upload
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Actual photo storage integration needed.</p>
            </div>
        )}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">Choose an Avatar</h3>
          <div className="flex justify-center space-x-2 flex-wrap gap-2">
            {predefinedAvatars.map(avatar => (
              <Button 
                key={avatar.id} 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-full p-0 border-2 hover:border-primary" 
                onClick={() => handleSelectPredefinedAvatar(avatar)} 
                title={`Select ${avatar.name}`}
                disabled={isProfileUpdating}
              >
                <Image 
                  src={avatar.url} 
                  alt={avatar.name} 
                  width={56} 
                  height={56} 
                  className="rounded-full object-cover"
                  data-ai-hint={avatar['data-ai-hint']}
                />
              </Button>
            ))}
             <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-full" 
                onClick={() => toast({title: "More Avatars Coming Soon!", description: "Look out for new avatar options in future updates."})} 
                title="More Avatars"
                disabled={isProfileUpdating}
              >
                <Palette className="h-7 w-7"/>
              </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-6 mt-4">
        <Button onClick={logOut} variant="outline" className="w-full" disabled={isProfileUpdating}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};
