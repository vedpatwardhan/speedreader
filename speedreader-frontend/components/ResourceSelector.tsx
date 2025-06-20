"use client"

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResourceType } from "@/types/main";


const ResourceSelector = ({ resources }: { resources: ResourceType[] }) => {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = useQueryState("name", { shallow: false });
  const [_, setSubstring] = useQueryState("substring");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between bg-transparent border-2"
        >
          {name
            ? resources.find(resource => resource.name === name)?.title
            : "Select resource..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {resources.map((resource) => (
                <CommandItem
                  key={resource.name}
                  value={resource.name}
                  onSelect={(currentValue) => {
                    setName(currentValue === name ? "" : currentValue);
                    setSubstring(null);
                    setOpen(false);
                  }}
                >
                  {resource.title}
                  <Check
                    className={cn(
                      "ml-auto",
                      name === resource.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ResourceSelector;
