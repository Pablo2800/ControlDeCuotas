import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import { setAllSocios,setFilterSocios } from "../redux/setSocios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const useFilters = () => {
    const dispatch = useDispatch();
    const notificarExito = (mensaje) => toast.success(mensaje);
    const notificarError = (error) => toast.error(`Error: ${error.message}`);
    const navigate = useNavigate()

    const handleAllServices = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/adm_clubes/clientes");
            dispatch(setAllSocios(data));
            notificarExito("Socios cargados exitosamente");
        } catch (error) {
            notificarError(error);
            console.error("Error al cargar todos los servicios:", error);
        }
    };
    const searchById = async (value) => {
        try {
            const response = await axios.get(
                "http://localhost:8080/adm_clubes/clientes/" + value
            );
            if (response) {
                const dataAsArray = [{ ...response.data }];
                dispatch(setFilterSocios(dataAsArray));
                navigate(`/socio/${value}`);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const searchByName = async(value) => { 
        try {
            const response = await axios.get("http://localhost:8080/adm_clubes/clientes/buscarCliente?letras="+value);
            if (response) {
                dispatch(setFilterSocios(response.data));
                navigate(`/socio/name/${value}`);
            }
        } catch (error) {
            console.log("Ocurrio un error: " + error);
        }
    }
    
    return {
        handleAllServices,
        searchById,
        searchByName,
        notificarExito,
        notificarError,
    }
}
export default useFilters