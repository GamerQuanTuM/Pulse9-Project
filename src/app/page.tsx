import React from "react";
import ForumCard from "@/components/forum-card";
import { getForums } from "@/actions/get-forums";
import ForumDialog from "@/components/forum-dialog";
import { serverProfile } from "@/actions/server-profile";

export const dynamic = "force-dynamic";

const Home = async () => {
  const { data: forums = [], success } = await getForums();
  const { data } = await serverProfile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Forums</h1>
          <ForumDialog />
        </div>

        {forums?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No forums found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forums?.map((forum: Forum) => (
              <ForumCard key={forum.id} forum={forum} user={data.data} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
