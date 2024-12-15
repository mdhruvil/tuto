import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateKnowledgeBase } from "@/hooks/knowledge-base-mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const createKnowledgeBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CreateKnowledgeBaseValues = z.infer<typeof createKnowledgeBaseSchema>;

export function CreateKnowledgeBaseButton() {
  const createKnowledgeBase = useCreateKnowledgeBase();
  const navigate = useNavigate();

  const form = useForm<CreateKnowledgeBaseValues>({
    resolver: zodResolver(createKnowledgeBaseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  function onSubmit(data: CreateKnowledgeBaseValues) {
    createKnowledgeBase.mutate(
      { json: data },
      {
        onSettled(data) {
          if (!data) return;
          navigate(`/dashboard/knowledge-bases/${data[0]?.id}`);
        },
      }
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (createKnowledgeBase.isPending) {
          return;
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Knowledge Base
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Knowledge Base</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter knowledge base name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter knowledge base description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" loading={createKnowledgeBase.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
