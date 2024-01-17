import {TextEditor} from "../components/textEditor"
import {APIReq} from "../components/apirequest";
import {useEffect, useState} from "react";

export const AddEmployee = () => {
    const [text, setText] = useState("");

    const defaultValue = "Nom : <br>Prénom : <br>Equipe : <br>Agence :";

    return (
        <div>
            Employee :
            <TextEditor defaultValue={defaultValue} OnChange={setText}/>
        </div>
    )
}


export const HandleNewPageForm = () => {
  const [message, setMessage] = useState("");
  const [formBody, setFormBody] = useState({
    pro: null,
    fun: null,
    text: ""
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    
    setFormBody({
      ...formBody,
      [name]: value,
    });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault() 
    
    APIReq.json("/pages/create", "POST", formBody)
      .then(() => {
        const timeOut = setTimeout(() => {
          window.location.href = "/admin/pageEditor/";
        }, 2000);
        
        return () => clearTimeout(timeOut);
      })
      .catch((err) => {
        if (err.message.includes("KO")) {
          const timeOut = setTimeout(() => {
            setMessage("");
          }, 5000);
          setMessage(err.message);
          
          return () => clearTimeout(timeOut);
        }
        console.error(err);
      });
  }
  
  return (
    <div className={"container"}>
      <h1>Créer un nouvel employé</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="pro" className="form-label">Photo pro</label>
          <input type="file" className="form-control" id="pro" name="pro" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="fun" className="form-label">Photo fun</label>
          <input type="file" className="form-control" id="fun" name="fun" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Information</label>
          <input type="text" className="form-control" id="page_position" name={"page_position"} onChange={handleChange} value={formBody.page_position} />
        </div>
        <button type="submit" className="btn btn-primary">Créer</button>
      </form>
      <div className="alert alert-danger" role="alert" hidden={message === ""}>
        {message}
      </div>
    </div>
  );
}

export const EmployeeEditor = () => {
  const [error, setError] = useState("");

  /* Handle table */
  const [EmployeeList, setEmployeeList] = useState([]);
  
  useEffect(() => {
    APIReq.withoutBody("/pages/list", "GET")
      .then((res) => {
        const EmployeeList =
          res.data.map((page) => {
            return {
              blocks: [...page.blocks],
              page: {
                ...page.page,
                dynamic: true,
              }
            }
          })
        setEmployeeList(EmployeeList.reverse());
        })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  const handleDelete = (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette page ?"))
      return;
    
    APIReq.withoutBody(`/pages/delete/${id}`, "DELETE")
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
  
  const handleChange = (e, page, action) => {
    e.preventDefault()
    let thisPage = EmployeeList.filter((p) => p.page.id === page.page.id);
    if (!thisPage?.length)
      return
    thisPage = thisPage[0]
    if (action === "nom")
      thisPage.firstName = e.target.innerText;
    else if (action === "prénom")
      thisPage.lastName = e.target.innerText;
    else if (action === "équipe")
      thisPage.team = e.target.innerText;
    else
      thisPage.agence = e.target.innerText;
    
    const isPresent = UpdatePage.filter((p) => p.page.id === page.page.id);
    if (isPresent.length === 0)
      UpdatePage.push(thisPage)
    else
      UpdatePage = UpdatePage.map((p) => {
        if (p.page.id === page.page.id)
          p = thisPage
        return p
      })
  }
  
  const handleSave = (e) => {
    e.preventDefault()
    if (!UpdatePage.length)
      return
    UpdatePage.forEach((Employee) => {
      const body = {
        firstName: Employee.firstName,
        lastName: Employee.lastName,
        team: Employee.équipe,
        agence: Employee.agence,
      }
        APIReq.json(`/pages/update/${Employee.id}`, "PUT", body)
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




  return (
    <div className={"container"}>
      <h1>Editeur d'équipe</h1>
      <button type={"button"} className={"btn btn-primary"} onClick={() => window.location.href = "/admin/pageEditor/new"}>Rajouter un employé</button>
      <table className={"table"}>
        <thead>
          <tr>
            <th scope={"col"} onClick={() => handleSort("nom")}>nom</th>
            <th scope={"col"} onClick={() => handleSort("prénom")}>prénom</th>
            <th scope={"col"} onClick={() => handleSort("équipe")}>équipe</th>
            <th scope={"col"} onClick={() => handleSort("agence")}>agence</th>
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
                dangerouslySetInnerHTML={{ __html: Employee.lastName }}
              />
             <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "prénom")}
                dangerouslySetInnerHTML={{ __html: Employee.firstName }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "équipe")}
                dangerouslySetInnerHTML={{ __html: Employee.team }}
              />
              <td
                contentEditable={true}
                onInput={(e) => handleChange(e, Employee, "agence")}
                dangerouslySetInnerHTML={{ __html: Employee.agence }}
              />
              <td>
                <button type={"button"} className={"btn btn-primary"} onClick={() => window.location.href = "/" + Employee.id}>Modifier</button>
                <button type={"button"} className={"btn btn-danger"} onClick={() => handleDelete(Employee.Employee.id)}>Supprimer</button>
              </td>
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
