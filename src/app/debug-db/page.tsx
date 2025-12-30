import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function DebugDBPage() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true, role: true, isActive: true },
            take: 20
        });
        const restaurants = await prisma.restaurant.findMany({
            select: { name: true, slug: true, isActive: true },
            take: 20
        });

        return (
            <div className="p-10 font-mono">
                <h1 className="text-2xl font-bold mb-4">Debug Database State</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm">
                        {JSON.stringify(users, null, 2)}
                    </pre>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Restaurants ({restaurants.length})</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm">
                        {JSON.stringify(restaurants, null, 2)}
                    </pre>
                </section>

                <div className="mt-8 text-sm text-gray-500">
                    Timestamp: {new Date().toISOString()}
                </div>
            </div>
        );
    } catch (error: any) {
        return (
            <div className="p-10 text-red-600 font-mono">
                <h1 className="text-2xl font-bold mb-4">DB Error</h1>
                <pre>{error.message}</pre>
                <div className="mt-4 text-gray-800">
                    URL: {process.env.DATABASE_URL?.replace(/:[^:]+@/, ":***@")}
                </div>
            </div>
        );
    }
}
