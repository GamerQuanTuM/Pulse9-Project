import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface CreateForumBody {
  title: string;
}

interface UpdateForumBody {
  title: string;
  id: string;
}

interface DeleteForumParams {
  id: string;
}

export async function getAllForums() {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        author: true,
        posts: true,
      },
    });

    return NextResponse.json(
      { message: "Success", data: forums },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
}

export const createForum = async (request: AuthenticatedRequest) => {
  const user_id = request.user?.id;

  const { title } = (await request.json()) as CreateForumBody;

  if (!title) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const forum = await prisma.forum.create({
    data: {
      title,
      author: {
        connect: {
          id: user_id,
        },
      },
    },
  });

  return NextResponse.json(
    { message: "Success", data: forum },
    { status: 201 }
  );
};

export const updateForum = async (request: AuthenticatedRequest) => {
  try {
    const user_id = request.user?.id;

    const { title, id } = (await request.json()) as UpdateForumBody;

    if (!id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 });
    }

    const isForumPresent = await prisma.forum.findUnique({
      where: {
        id: id,
      },
    });

    if (!isForumPresent) {
      return NextResponse.json({ message: "Forum not found" }, { status: 404 });
    }

    const isAuthor = isForumPresent?.authorId === user_id; // Check if the user is the author of the forum

    if (!isAuthor) {
      return NextResponse.json(
        { message: "You are not authorized to update this forum" },
        { status: 403 }
      );
    }

    const forum = await prisma.forum.update({
      where: {
        id: id,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(
      { message: "Success", data: forum },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

// export const deleteForum = async (
//   request: AuthenticatedRequest,
//   params?: { params: Record<string, string> }
// ) => {
//   try {
//     const id = params?.params?.id;

//     if (!id) {
//       return NextResponse.json({ message: "Id is required" }, { status: 400 });
//     }

//     const isForumPresent = await prisma.forum.findUnique({
//       where: {
//         id: id,
//       },
//     });

//     if (!isForumPresent) {
//       return NextResponse.json({ message: "Forum not found" }, { status: 404 });
//     }

//     const isAuthor = isForumPresent?.authorId === request.user?.id;

//     if (!isAuthor) {
//       return NextResponse.json(
//         { message: "You are not authorized to delete this forum" },
//         { status: 403 }
//       );
//     }

//     const forum = await prisma.forum.delete({
//       where: {
//         id: id,
//       },
//     });

//     return NextResponse.json(
//       { message: "Success", data: forum },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error.message, data: null },
//       { status: 500 }
//     );
//   }
// };

export const GET = withAuth(getAllForums);
export const POST = withAuth(createForum);
export const PUT = withAuth(updateForum);
// export const DELETE = withAuth(deleteForum);
