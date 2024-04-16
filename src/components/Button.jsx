import React from "react";
import PropTypes from "prop-types";

const Button = ({ href, classe, children }) => {
  // Détermine si le lien doit être utilisé en fonction de la présence de href
  const ButtonComponent = href ? "a" : "button";

  return (
    <ButtonComponent href={href} className={classe}>
      {children}
    </ButtonComponent>
  );
};

Button.propTypes = {
  href: PropTypes.string,
  classe: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
