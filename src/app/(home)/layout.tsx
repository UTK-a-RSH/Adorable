
import { BackgroundArt } from "@/components/ui/background-art";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
    <main className="min-h-screen w-full bg-background relative text-foreground">
            <BackgroundArt />
            <div className="flex-1 flex flex-col px-4 pb-4 relative z-10">
                {children}
            </div>
        </main>
    );
};

export default Layout;
