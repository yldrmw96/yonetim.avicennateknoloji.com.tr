"use server"
import { Client } from "./client";
import { SessionService } from "@/lib/services/session.service";

/**
 * Bu bileşen, sidebar'ın varsayılan durumunu
 * görüntüler.
 * 
 * Bu bileşen, client bileşenini çağırır ve server tarafından
 * gelen user ve selectedSiteId'yi sidebar'a aktarır.
 */

export default async function Default() {
  // const user = await SessionService.getUserFromCookie();
  // const selectedSiteId = Number(user?.selectedSiteId);

  // // console.log(user);
  // const props = {
  //   user: { id: Number(user?.id), ...user },
  //   sitesFromServer: user?.sites || [],
  //   selectedSiteId: selectedSiteId,
  // }
  return (
    <Client />
  );
}
