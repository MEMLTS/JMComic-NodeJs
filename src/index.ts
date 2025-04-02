import { fetchAndProcessPhoto } from "@/modules/photo";
import { detail } from "@/modules/detail";
import { Introduction } from "@/modules/Introduction";
import { search } from "@/modules/search";

const modules = {
    fetchAndProcessPhoto,
    detail,
    Introduction,
    search
};

export default modules;

export { fetchAndProcessPhoto, detail, Introduction, search };
