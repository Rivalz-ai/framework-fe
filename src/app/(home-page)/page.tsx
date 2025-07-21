"use client";
import LoginModal from "@/components/customs/login-modal";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGetListSwarms } from "@/hooks/apis/swarms";
import { useGlobalStore } from "@/stores";

import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { setProjectSelectedToLocal } from "@/lib/clients/storage.helper";
import { useRouter } from "next/navigation";
import { useGetPartner } from "@/features/partner/hooks/api";
import Spinner from "@/components/customs/spinner";
import Chat from "@/components/customs/chat-v2";
import { useGetTypeOfUser } from "@/hooks/apis/agent";

export default function Homepage() {
  const { data: session } = useSession();
  const { isAuthenticated, isLoading } = useAuth();
  const { mutateAsync: getListSwarms, isPending: isLoadingListSwarms } =
    useGetListSwarms();
  const [isExistedSwarm, setIsExistedSwarm] = useState(false);
  const [isLoadingData, setIsLoadData] = useState(false);
  const [{ swarmSelected }, setGlobalState] = useGlobalStore();
  const { typeOfUser, isTypeOfUserLoading } = useGetTypeOfUser(
    //"167582630898g5548800"
    session?.user.twitterId ?? ""
  );
  const { partners, isLoadingPartners } = useGetPartner(
    session?.user.twitterId ?? ""
  );
  const router = useRouter();
  useEffect(() => {
    const checkUserType = async () => {
      if (isLoading) return;
      setIsLoadData(true);
      if (
        isAuthenticated &&
        session?.user.twitterId &&
        !isLoadingPartners &&
        !isTypeOfUserLoading
      ) {
        try {
          switch (typeOfUser?.type) {
            case "USER":
              if (
                partners &&
                partners.length > 0 &&
                partners[0].agents &&
                partners[0].agents.length > 0
              ) {
                router.replace(
                  `/partner/${partners[0].agents[0]._id}/agent/${partners[0].agents[0].name}`
                );
              } else {
                toast.error("No valid partner or agent data found");
              }
              break;
            case "SWARM_OWNER":
              const listSwarms = await getListSwarms(session.user.twitterId);
              setGlobalState({ swarmSelected: listSwarms[0] });
              setProjectSelectedToLocal(listSwarms[0].project_id);
              setIsExistedSwarm(true);
              break;
            case "UNAUTHENTICATED":
            default:
              toast.error("Your twitter account not link to rome.");
              setTimeout(() => {
                signOut();
              }, 5000);
              break;
          }
        } catch (error: any) {
          toast.error("Error " + error.message);
          setTimeout(() => {
            signOut();
          }, 5000);
        } finally {
          setIsLoadData(false);
        }
      } else {
        setIsExistedSwarm(false);
        setIsLoadData(false);
      }
    };
    checkUserType();
  }, [isAuthenticated, session?.user.twitterId, typeOfUser, partners]);

  return (
    <div className="flex flex-1 flex-col">
      {isExistedSwarm && (
        <>
          <div className="flex flex-1 h-screen items-center justify-center ">
            <Chat projectId={""} />
          </div>
        </>
      )}
      {!isAuthenticated && !isLoading && <LoginModal open={!isExistedSwarm} />}
      {isAuthenticated &&
        !isLoading &&
        (isLoadingPartners || isLoadingData) && (
          <div className="flex w-full h-full items-center justify-center">
            Loading <Spinner />
          </div>
        )}
    </div>
  );
}
