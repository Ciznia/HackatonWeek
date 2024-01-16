import React, { useState, useEffect, useRef} from "react";
import { SiteMap } from "../data/SiteMap"
import { useLocation, useNavigate } from "react-router-dom";
import "./navigationBar.scss"

const Link = React.forwardRef(({ path, children }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <a ref={ref} href={path} onClick={handleClick}>
      {children}
    </a>
  );
});


const MenuButton = ({children}) => {
  return (
    <button className="subnavbtn">
      {children}
    </button>
  )
}

const MenuContent = ({children}) => {
  return (
    <div className="subnav-content">
      {children}
    </div>
  )
}

const Menu = ({children}) => {
  return (
    <div className="subnav">
      {children}
    </div>
  )
}

const Menus = ({Refs}) => {
  const nestedStructure = {};

  SiteMap.forEach((item) => {
    const routeSegments = item.Route.split("/").slice(1);
    let currentLevel = nestedStructure;

    routeSegments.forEach((segment, index) => {
      if (!currentLevel[segment]) {
        if (index === routeSegments.length - 1) {
          currentLevel[segment] = null;
        } else {
          currentLevel[segment] = {};
        }
      }
      currentLevel = currentLevel[segment];
    });
  });

  const createMenu = (data, route) => {
    return Object.keys(data).map((key) => {
      const value = data[key];
      if (value === null) {
        const linkRef = React.createRef();
        Refs.current[key] = linkRef;
        return <Link id={key} key={key} path={`${route}/${key}`} ref={linkRef}>{key}</Link>;
      } else {
        return (
          <Menu key={key}>
            <MenuButton>{key}</MenuButton>
            <MenuContent>
              {createMenu(value, `${route}/${key}`)}
            </MenuContent>
          </Menu>
        );
      }
      });
    };

  return createMenu(nestedStructure, '')
}

const SearchBar = ({Refs}) => {

  const AvailablePages = SiteMap.map((item) => {
    const RoutePart = item.Route.split("/")
    return RoutePart.at(RoutePart.length - 1)
  });
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState(AvailablePages)


  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const matchingSuggestions = AvailablePages.filter(Page =>
      Page.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matchingSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions(AvailablePages);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
    const matchingRefKey = Object.keys(Refs.current).find((key) => key.toLowerCase() === inputValue.toLowerCase());
    if (matchingRefKey) {
      const selectedRef = Refs.current[matchingRefKey];
      if (selectedRef && selectedRef.current) {
        selectedRef.current.click()
      }
    }
  }, 100)

  return () => clearTimeout(timeoutId)
  }, [inputValue, Refs]);

  return (
    <div className="search-bar">
      <label htmlFor="Pages" />
      <input
        type="text"
        placeholder="Recherchez ..."
        id="Pages"
        list="PagesList"
        value={inputValue}
        onChange={handleInputChange}
      />
      <datalist id="PagesList">
        {suggestions.map((suggestion, index) => (
          <option
            key={index}
            value={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
          />
        ))}
      </datalist>
    </div>
  );
}

export const NavigationBar = () => {

  const Refs = useRef({})
  return (
    <nav className="navigation-bar">
      <div className="navbar">
        <Menus Refs={Refs}/>
        <SearchBar Refs={Refs}/>
      </div>
    </nav>
  );
};
