"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { downloadResource } from "@/lib/utils";

const ResourceDownloader = ({ downloading, setDownloading }: {
    downloading: boolean,
    setDownloading: Dispatch<SetStateAction<boolean>>;
}) => {
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="border-2" disabled={downloading}>Download Resource</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Download Resource</DialogTitle>
                    <DialogDescription>
                        Add the url to the blog or pdf to be downloaded below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => {
                        setDownloading(true);
                        setOpen(false);
                        downloadResource(url).then(() => {
                            setDownloading(false);
                        }).catch((e) => {
                            console.dir(e);
                            setDownloading(false)
                        })
                    }}>Download</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default ResourceDownloader;
