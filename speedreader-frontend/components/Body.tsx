import { ResourceType, ResourceContentType, NotesType } from "@/types/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Notes from "./Notes";
import Resource from "./Resource";
import { getNotes, getResourceContents, getResources } from "@/lib/utils";
import TopBar from "./TopBar";
import Chat from "./Chat";

const Body = async ({ name }: { name: string | undefined }) => {
    const resources: ResourceType[] = await getResources();
    const resourceContents: ResourceContentType = await getResourceContents(name);
    const notes: NotesType = await getNotes(name);

    return (
        <div className="flex flex-col h-full w-full p-4">
            <div className="w-full flex justify-between">
                <h1 className="text-3xl font-bold">Speedreader</h1>
                <TopBar resources={resources} />
            </div>
            <div className="flex-1 flex my-4 gap-4">
                <Tabs className="w-1/2 flex flex-col items-center" defaultValue="resource">
                    <TabsList className="flex gap-4 mb-1">
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="resource">Resource</TabsTrigger>
                    </TabsList>
                    <TabsContent value="notes" className="w-full flex-1 mx-4">
                        <Notes notes={notes} />
                    </TabsContent>
                    <TabsContent value="resource" className="w-full flex-1 mx-4">
                        <Resource name={name} resourceContents={resourceContents} />
                    </TabsContent>
                </Tabs>
                <Chat name={name} />
            </div>
        </div>
    )
}

export default Body;
