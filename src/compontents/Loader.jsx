import { TailSpin } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-[400px]">
                            <TailSpin
                            height={80}
                            width={80}
                            color="#4fa94d"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            visible={true}
                            />
        </div>
    );
}

export default Loader;