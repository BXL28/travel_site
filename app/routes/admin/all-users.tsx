import { Header } from "../../components";
import { ColumnsDirective, ColumnDirective, GridComponent } from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";

export const loader = async () => {
    const { users, total } = await getAllUsers(10, 0);
    return { users, total };
}

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
    const { users, total } = loaderData;

    return (
        <main className="all-users pt-32 pb-20 bg-[#FAFBFC]">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <Header
                    title="User Management"
                    description={`Overview of all ${total} registered explorers and their activity levels.`}
                />

                <section className="mt-12">
                    <div className="flex flex-col gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="px-2">
                            <h2 className="text-2xl font-bold text-slate-900">Active Explorers</h2>
                            <p className="text-slate-500 text-sm mt-1">Manage profiles, verify emails, and track join dates.</p>
                        </div>

                        <GridComponent
                            dataSource={users}
                            gridLines="None"
                            rowHeight={70}
                            cssClass="custom-user-grid"
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="name"
                                    headerText="User Profile"
                                    width="250"
                                    textAlign="Left"
                                    template={(props: any) => (
                                        <div className="flex items-center gap-3 px-2">
                                            <img
                                                src={props.imageUrl}
                                                alt="user"
                                                className="rounded-full size-11 object-cover border-2 border-slate-50 shadow-sm"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-bold leading-none">{props.name}</span>
                                                <span className="text-slate-400 text-xs mt-1">ID: {props.$id?.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <ColumnDirective
                                    field="email"
                                    headerText="Email Address"
                                    width="220"
                                    textAlign="Left"
                                    template={(props: any) => (
                                        <span className="text-slate-600 font-medium">{props.email}</span>
                                    )}
                                />
                                <ColumnDirective
                                    field="joinedAt"
                                    headerText="Onboarded"
                                    width="160"
                                    textAlign="Left"
                                    template={({joinedAt}: { joinedAt: string}) => (
                                        <span className="text-slate-500 text-sm font-medium">
                                            {formatDate(joinedAt)}
                                        </span>
                                    )}
                                />
                                <ColumnDirective
                                    field="status"
                                    headerText="Tier"
                                    width="140"
                                    textAlign="Left"
                                    template={({ status }: any) => {
                                        const isUser = status === 'user';
                                        return (
                                            <div className={cn(
                                                'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border',
                                                isUser
                                                    ? 'bg-success-50 border-success-100'
                                                    : 'bg-slate-50 border-slate-200'
                                            )}>
                                                <div className={cn(
                                                    'size-2 rounded-full',
                                                    isUser ? 'bg-success-500' : 'bg-slate-400'
                                                )} />
                                                <span className={cn(
                                                    'text-xs font-bold uppercase tracking-wider',
                                                    isUser ? 'text-success-700' : 'text-slate-600'
                                                )}>
                                                    {status}
                                                </span>
                                            </div>
                                        );
                                    }}
                                />
                            </ColumnsDirective>
                        </GridComponent>
                    </div>
                </section>
            </div>

            {/* Injected styles to clean up the Syncfusion table to match the UI */}
            <style dangerouslySetInnerHTML={{ __html: `
                .e-grid {
                    border: none !important;
                    font-family: inherit !important;
                }
                .e-grid .e-headercell {
                    background-color: transparent !important;
                    border-bottom: 1px solid #F1F5F9 !important;
                    padding-bottom: 12px !important;
                }
                .e-grid .e-headertext {
                    color: #64748B !important;
                    font-weight: 700 !important;
                    font-size: 12px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                }
                .e-grid .e-rowcell {
                    border: none !important;
                }
                .e-grid .e-gridcontent tr:hover {
                    background-color: #F8FAFC !important;
                }
            `}} />
        </main>
    );
};

export default AllUsers;