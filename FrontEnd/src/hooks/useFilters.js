import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSocios,
  getAño,
  getCategoria,
  getMes,
  setAllPagos,
  setAllSocios,
  setAño,
  setCategoria,
  setFilterSocios,
  setHistorial,
  setMes,
  setMontoTotal,
} from "../redux/setSocios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  login,
  logout,
  setAccess,
  setPassword,
  setUsername,
} from "../redux/setUsuario";

const useFilters = () => {
  const dispatch = useDispatch();
  const notificarExito = (mensaje) => toast.success(mensaje);
  const notificarError = (error) => toast.error(`${error.response.data}`);
  const notifyError = (mensaje) => toast.error(mensaje);
  const socios = useSelector(getAllSocios);
  const navigate = useNavigate();
  const mes = useSelector(getMes);
  const año = useSelector(getAño);
  const categoria = useSelector(getCategoria);

  const handleAllSocios = async () => {
    try {
      const { data } = await axios.get(
        "https://controldecuotas.onrender.com/adm_clubes/clientes"
      );
      dispatch(setAllSocios(data));
      // notificarExito("Socios cargados exitosamente");
    } catch (error) {
      notificarError(error);
    }
  };

  const searchById = async (value) => {
    if (value.trim() !== "") {
      try {
        const response = await axios.get(
          "https://controldecuotas.onrender.com/adm_clubes/clientes/" + value
        );
        if (response) {
          const dataAsArray = [{ ...response.data }];
          dispatch(setFilterSocios(dataAsArray));
          navigate(`/socio/${value}`);
        }
      } catch (error) {
        if (error.response.status === 400 || error.response.status === 404) {
          notifyError("No se encuentra un usuario con esa Id");
        }
      }
    } else {
      notifyError("El campo de búsqueda está vacío");
    }
  };

  const searchByName = async (value) => {
    if (value.trim() !== "") {
      try {
        const response = await axios.get(
          "https://controldecuotas.onrender.com/adm_clubes/clientes/buscarCliente?letras=" +
            value
        );
        if (response.data.length > 0) {
          dispatch(setFilterSocios(response.data));
          navigate(`/socios/filtered`);
        }
      } catch (error) {
        notifyError("Ocurrió un error al realizar la búsqueda");
      }
    } else {
      notifyError("El campo de búsqueda está vacío");
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "https://controldecuotas.onrender.com/adm_clubes/clientes",
        values
      );
      if (response.data) {
        notificarExito("Usuario creado con exito");
        setTimeout(() => {
          navigate("/inicio");
        }, 2000);
      }
    } catch (error) {
      notifyError(error.response.data.error);
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "https://controldecuotas.onrender.com/adm_clubes/usuario/login",
        values
      );
      dispatch(setUsername(response.data.username));
      dispatch(setPassword(response.data.password));
      dispatch(setAccess(response.data.access));
      dispatch(login());
    } catch (error) {
      notificarError(error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const pago = async (values) => {
    const { cliente_id, fecha, monto } = values;
    const partes = fecha.split("-");
    const nuevaFecha = partes[2] + "-" + partes[1] + "-" + partes[0];
    try {
      const response = await axios.post(
        `https://controldecuotas.onrender.com/adm_clubes/pago_mensuales/${cliente_id}/pagos?opcionPago=2`,
        { fecha: nuevaFecha, monto }
      );
      if (response.data) {
        notificarExito("Pago realizado con exito");
        setTimeout(() => {
          navigate("/inicio");
        }, 2000);
      }
    } catch (error) {
      notificarError(error);
    }
  };

  const pagoAtrasado = async (values) => {
    const { cliente_id, fecha, monto } = values;
    const partes = fecha.split("-");
    const nuevaFecha = partes[2] + "-" + partes[1] + "-" + partes[0];
    try {
      const response = await axios.post(
        `https://controldecuotas.onrender.com/adm_clubes/pago_mensuales/${cliente_id}/pagos?opcionPago=1`,
        { fecha: nuevaFecha, monto }
      );
      if (response.data) {
        notificarExito("Pago realizado con exito");
        setTimeout(() => {
          navigate("/inicio");
        }, 2000);
      }
    } catch (error) {
      notificarError(error);
    }
  };

  const deleteSocios = async (value) => {
    try {
      await axios.delete(
        "https://controldecuotas.onrender.com/adm_clubes/clientes/" + value.id
      );
      const updatedSocios = socios.filter((socio) => socio.id !== value.id);
      dispatch(setAllSocios(updatedSocios));
      notificarExito("Usuario eliminado con éxito");
    } catch (error) {
      notificarError(error);
    }
  };

  const edit = async (values) => {
    try {
      const response = await axios.put(
        "https://controldecuotas.onrender.com/adm_clubes/clientes/" + values.id,
        values
      );
      if (response.data) {
        notificarExito("Usuario editado con éxito");
      }
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (error) {
      notificarError(error);
    }
  };

  const historialDePago = async (value) => {
    try {
      const response = await axios.get(
        `https://controldecuotas.onrender.com/adm_clubes/pago_mensuales/cliente/${value.id}/pagos`
      );
      if (response.data) {
        dispatch(setHistorial(response.data));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        notificarError(error);
        dispatch(setHistorial([]));
      } else {
        notificarError(error);
      }
    }
  };

  const allPagos = async () => {
    try {
      const response = await axios.get(
        "https://controldecuotas.onrender.com/adm_clubes/pago_mensuales"
      );
      if (response) {
        dispatch(setAllPagos(response.data));
      }
    } catch (error) {
      notificarError(error);
    }
  };

  const handleMenuClick = async (itemKey) => {
    console.log(itemKey);
    try {
      const response = await axios.get(
        "https://controldecuotas.onrender.com/adm_clubes/clientes/categoria/" +
          itemKey
      );
      if (response.data.length > 0) {
        dispatch(setFilterSocios(response.data));
        navigate("/socios/filtered");
      } else notifyError("No hay socios en esta categoria");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePagos = async (values) => {
    const { mes, año, categoria } = values;
    try {
      const response = await axios.get(
        `https://controldecuotas.onrender.com/adm_clubes/clientes/clientesPorPagoMesYCategoria?mesAno=${mes}-${año}&categoria=${categoria}`
      );
      if (response.data.clientes.length > 0) {
        dispatch(setFilterSocios(response.data.clientes));
        dispatch(setMontoTotal(response.data.montoTotal));
        dispatch(setMes(mes));
        dispatch(setAño(año));
        dispatch(setCategoria(categoria));
        navigate("/pagoDeSocios");
      } else notifyError("No se encontraron pagos en ese mes/año");
    } catch (error) {
      notifyError(error);
    }
  };

  const downloadDataPDF = async () => {
    try {
      const response = await axios.get(
        `https://controldecuotas.onrender.com/adm_clubes/generacionPDF/reporte/pdf?categoria=${categoria}&mesAno=${mes}-${año}`,
        { responseType: "blob" }
      );

      if (response) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_${categoria}_${mes}_${año}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const downloadDataExcel = async () => {
    try {
      const response = await axios.get(
        `https://controldecuotas.onrender.com/adm_clubes/excel/reporte_Mensual?categoria=${categoria}&mesAno=${mes}/${año}`,
        { responseType: "blob" }
      );
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Reporte_${categoria}_${mes}_${año}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      notifyError("Algo salio mal");
      console.log(error);
    }
  };
  const handleExtract = async () => {
    try {
      const response = await axios.get(
        `https://controldecuotas.onrender.com/adm_clubes/excel/exportar_Todas_las_tablas`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return {
    handleExtract,
    handleAllSocios,
    handleMenuClick,
    searchById,
    searchByName,
    notificarExito,
    notificarError,
    onFinish,
    deleteSocios,
    edit,
    historialDePago,
    pago,
    allPagos,
    handleLogin,
    handleLogout,
    handlePagos,
    downloadDataPDF,
    downloadDataExcel,
    pagoAtrasado,
  };
};

export default useFilters;
