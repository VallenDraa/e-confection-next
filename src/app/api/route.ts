export async function GET(req: Request) {
  return Response.json({ hello: "world" }, { status: 201 });
}
