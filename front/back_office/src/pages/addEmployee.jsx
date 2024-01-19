import {TextEditor} from "../components/textEditor"
import {APIReq} from "../components/apirequest";
import {useEffect, useState} from "react";
import "./employee.css"

const EmployeeShow = ({employee}) => {
  const [hovered, setHovered] = useState(false);

  function onMouseEnter() {
    setHovered(true);
  }

  function onMouseLeave() {
    setHovered(false);
  }

  return (
    <div
        key={employee.id}
        className={`image-wrapper ${hovered ? 'hovered' : ''}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <img
            src={hovered ? employee.photo_fun : employee.photo_pro}
            alt={hovered ? "Fun image" : "Professional image"}
        />
        {hovered && (
            <div className="overlay">
                <div className="overlay-content">
                    <p>{employee.prenom} {employee.nom}</p>
                </div>
            </div>
        )}
    </div>
  )
}

export const EmployeeEditor = () => {
  const [error, setError] = useState("");

  /* Handle table */
  const [EmployeeList, setEmployeeList] = useState([]);
  
  useEffect(() => {
    APIReq.withoutBody("/api/employees", "GET")
      .then((res) => {
        setEmployeeList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  const handleDelete = (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?"))
      return;
    
    APIReq.withoutBody(`/api/delete-employee/${id}`, "DELETE")
      .then(() => {
        setEmployeeList(EmployeeList.filter((page) => page.page.id !== id));
      })
      .catch((err) => {
        if (err.message.includes("KO")) {
          const timeOut = setTimeout(() => {
            setError("");
          }, 5000);
          setError(err.message);
          
          return () => clearTimeout(timeOut);
        }
        console.error(err);
      });
  }

  let UpdatePage = [];
  
  const handleChange = (e, Employee, action) => {
    e.preventDefault()
    let thisPage = EmployeeList.filter((em) => em.id === Employee.id);
    if (!thisPage?.length)
      return
    thisPage = thisPage[0]
    if (action === "nom")
      thisPage.nom = e.target.innerText;
    else if (action === "prénom")
      thisPage.prenom = e.target.innerText;
    else if (action === "équipe")
      thisPage.equipe = e.target.innerText;
    else if (action === "agence")
      thisPage.agence = e.target.innerText;
    else
      thisPage.poste = e.target.innerText
    
    const isPresent = UpdatePage.filter((p) => p.id === Employee.id);
    if (isPresent.length === 0)
      UpdatePage.push(thisPage)
    else
      UpdatePage = UpdatePage.map((p) => {
        if (p.id === Employee.id)
          p = thisPage
        return p
      })
  }
  
  const handleSave = (e) => {
    e.preventDefault()
    console.log(UpdatePage)
    if (!UpdatePage.length)
      return
    UpdatePage.forEach((Employee) => {
      const body = {
        prenom: Employee.prenom,
        nom: Employee.nom,
        equipe: Employee.equipe,
        agence: Employee.agence,
        poste: Employee.poste,
        photo_fun: Employee.photo_fun,
        photo_pro: Employee.photo_pro
      }
      console.log(body)
        APIReq.json(`/api/update-employee/${Employee.id}`, "PUT", body)
            .then((res) => {
            setEmployeeList(prevState => {
                return prevState.map((e) => {
                    if (e.id === Employee.id) {
                        e = res.data
                    }
                    return e
                })
            })
            })
            .catch((err) => {
            if (err.message.includes("KO")) {
                const timeOut = setTimeout(() => {
                setError("");
                }, 5000);
                setError(err.message);
                
                return () => clearTimeout(timeOut);
            }
            console.error(err);
            });
    });
  }
    
  const [dynamicSortColumn, setDynamicSortColumn] = useState("nom");
  const [dynamicSortOrder, setDynamicSortOrder] = useState("asc");

  const handleSort = (column) => {
        // Toggle the sorting order if the same column is clicked again
        if (column === dynamicSortColumn) {
            setDynamicSortOrder(dynamicSortOrder === "asc" ? "desc" : "asc");
        } else {
        // Set the new sorting column and default to ascending order
            setDynamicSortColumn(column);
            setDynamicSortOrder("asc");
        }
    }

    /* Handle new Employee */
    const [displayNew, setDisplayNew] = useState(false);
    const [text, setText] = useState("");

    const defaultValue = "nom : <br>prenom : <br>equipe : <br>agence : <br> poste : <br> lien photo_pro : <br> lien photo_fun :";

    const handleSubmit = (e) => {
      e.preventDefault();
      const form = new FormData();

      const data = text.split("<br>").map((a) => a.trim().split(":").map((b) => b.trim()));
      /* Remove html tag used needed within the text editor */
      data[0][0] = data[0][0].slice(3);
      data[5][0] = data[5][0].slice(5);
      data[6][0] = data[6][0].slice(5);
      data[6][1] = data[6][1].slice(0, -4);
      console.info(data);
      data.map((a) => form.set(a[0], a[1]));

      APIReq.autoType('/api/add-employee', "POST", form)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    }

    // Handle apercu
    const [apercu, setApercu] = useState(false)

  return (
    <div className={"container"}>
      <h1>Editeur d'équipe</h1>
      {!displayNew && <button type={"button"} className={"btn btn-primary"} onClick={() => setDisplayNew(true)}>Rajouter un employé</button>}
      {displayNew && <button type={"button"} className={"btn btn-primary"} onClick={() => setDisplayNew(false)}>Annuler</button>}
      {displayNew && (
        <div>
          <form onSubmit={handleSubmit}>
            <TextEditor defaultValue={defaultValue} OnChange={setText}/>
          </form>
        </div>
      )}
      {!apercu && <button type={"button"} className={"btn btn-primary"} onClick={() => setApercu(true)}>Aperçu</button>}
      {apercu && <button type={"button"} className={"btn btn-primary"} onClick={() => setApercu(false)}><s>Aperçu</s></button>}
      <table className={"table"}>
        <thead>
          <tr>
            <th scope={"col"} onClick={() => handleSort("nom")}>nom</th>
            <th scope={"col"} onClick={() => handleSort("prenom")}>prénom</th>
            <th scope={"col"} onClick={() => handleSort("equipe")}>équipe</th>
            <th scope={"col"} onClick={() => handleSort("agence")}>agence</th>
            <th scope={"col"} onClick={() => handleSort("poste")}>poste</th>
            <th scope={"col"} onClick={() => handleSort("photo_pro")}>photo principale</th>
            <th scope={"col"} onClick={() => handleSort("photo_fun")}>photo alternative</th>
            <th scope={"col"}>Action </th>
            {apercu && <th scope={"col"} >Apperçu</th>}
          </tr>
        </thead>
        <tbody>
          {EmployeeList.sort((a, b) => {
            const aValue = a[dynamicSortColumn];
            const bValue = b[dynamicSortColumn];
            const order = dynamicSortOrder === "asc" ? 1 : -1;
            

            return aValue?.localeCompare(bValue) * order;
          })
          .map((Employee) => (
            <tr key={Employee.id}>
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "nom")}
                dangerouslySetInnerHTML={{ __html: Employee.nom }}
              />
             <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "prénom")}
                dangerouslySetInnerHTML={{ __html: Employee.prenom }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "équipe")}
                dangerouslySetInnerHTML={{ __html: Employee.equipe }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "agence")}
                dangerouslySetInnerHTML={{ __html: Employee.agence }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "poste")}
                dangerouslySetInnerHTML={{ __html: Employee.poste }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "photo_fun")}
                dangerouslySetInnerHTML={{ __html: Employee.photo_fun }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "photo_pro")}
                dangerouslySetInnerHTML={{ __html: Employee.photo_pro }}
              />
              <td>
                <button type={"button"} className={"btn btn-danger"} onClick={() => handleDelete(Employee.id)}>Supprimer</button>
              </td>
              {apercu && (
              <td>
                <EmployeeShow employee={Employee}/>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <button type={"button"} className={"btn btn-primary"} onClick={handleSave}>Sauvegarder</button>
      <div className="alert alert-danger" role="alert" hidden={error === ""}>
        {error}
      </div>
    </div>
  );
}
