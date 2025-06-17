"use client";

import { ResourceType } from "@/types/main";
import ResourceDownloader from "./ResourceDownloader";
import ResourceSelector from "./ResourceSelector";
import { useState } from "react";
import { Loader } from "lucide-react";

const TopBar = ({ resources }: { resources: ResourceType[] }) => {
    const [downloading, setDownloading] = useState(false);
    return (
        <div className="flex gap-2 items-center">
            {downloading && <Loader className="animate-spin mr-2" />}
            <ResourceDownloader downloading={downloading} setDownloading={setDownloading} />
            <ResourceSelector resources={resources} />
        </div>
    );
};

export default TopBar;
