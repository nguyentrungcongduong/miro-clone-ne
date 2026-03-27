import { ref } from "vue";
import { yDocStore } from "./../../../../../store/yDoc";
import { LoginResponseType } from "../../../../../helper/auth";
import { throttle } from "lodash-es";

export function useShareUserCursor(userData: LoginResponseType | undefined) {

    const trackMousePosition = throttle(function (event: any) {
        const userName = userData?.user?.name
        yDocStore.mousePosition.x = event.clientX;
        yDocStore.mousePosition.y = event.clientY;
        yDocStore.mousePosition.userName = userName as string

        yDocStore.yMouse.set("x", event.clientX);
        yDocStore.yMouse.set("y", event.clientY);
        yDocStore.yMouse.set("userName", userName);
    }, 50); // Throttle to 20fps for cursor movement

    return {
        trackMousePosition,
    };
}
