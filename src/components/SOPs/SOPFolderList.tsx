import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, Loader2 } from "lucide-react"

interface SOPFolderListProps {
  folders: { id: string; name: string }[]
  selectedFolder: string | null
  onSelectFolder: (folderId: string) => void
  loading: boolean
}

export function SOPFolderList({ 
  folders, 
  selectedFolder, 
  onSelectFolder,
  loading 
}: SOPFolderListProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (folders.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px] text-muted-foreground">
          No folders available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SOP Folders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                selectedFolder === folder.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => onSelectFolder(folder.id)}
            >
              <Folder className="h-5 w-5 mr-3" />
              <span>{folder.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 