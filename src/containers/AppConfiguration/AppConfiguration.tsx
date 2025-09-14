import React, { useRef } from "react";
import Icon from "../../assets/GearSix.svg";
import localeTexts from "../../common/locales/en-us/index";
import styles from "./AppConfiguration.module.css";
import { useInstallationData } from "../../common/hooks/useInstallationData";
import Tooltip from "../Tooltip/Tooltip";

const AppConfigurationExtension: React.FC = () => {
  const { installationData, setInstallationData } = useInstallationData();

  const fields = {
    contentstack_stack_api_key: useRef<HTMLInputElement>(null),
    contentstack_delivery_token: useRef<HTMLInputElement>(null),
    contentstack_environment: useRef<HTMLInputElement>(null),
    pinecone_api_key: useRef<HTMLInputElement>(null),
    pinecone_environment: useRef<HTMLInputElement>(null),
    pinecone_index_name: useRef<HTMLInputElement>(null),
  };

const updateConfig = () => {
  const config = {
    configuration: {
      contentstack_stack_api_key: fields.contentstack_stack_api_key.current?.value || "",
      contentstack_delivery_token: fields.contentstack_delivery_token.current?.value || "",
      contentstack_environment: fields.contentstack_environment.current?.value || "",
      pinecone_environment: fields.pinecone_environment.current?.value || "",
      pinecone_index_name: fields.pinecone_index_name.current?.value || "",
    },
    serverConfiguration: {
      pinecone_api_key: fields.pinecone_api_key.current?.value || "",
    },
  };

  console.log("Updated Configuration:", config); 
  
  if (typeof setInstallationData !== "undefined") {
    setInstallationData(config);
  }
};


  const getValue = (key: string, isSecure = false): string => {
    const value = isSecure
      ? installationData?.serverConfiguration?.[key]
      : installationData?.configuration?.[key];

    return typeof value === "string" ? value : "";
  };

  const renderField = (
    label: string,
    key: string,
    tooltip?: string,
    isSecure = false
  ) => (
    <div className={`${styles.infoContainerWrapper}`} key={key}>
      <div className={`${styles.infoContainer}`}>
        <div className={`${styles.labelWrapper}`}>
          <label htmlFor={key}>{label}</label>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      </div>
      <div className={`${styles.inputContainer}`}>
        <input
          type={isSecure ? "password" : "text"}
          id={key}
          ref={fields[key as keyof typeof fields]}
          value={getValue(key, isSecure)}
          placeholder="Enter value"
          name={key}
          autoComplete="off"
          className={`${styles.fieldInput}`}
          onChange={updateConfig}
        />
      </div>
    </div>
  );

  return (
    <div className={`${styles.layoutContainer}`}>
      <div className={`${styles.appConfig}`}>
        <div className={`${styles.appConfigLogoContainer}`}>
          <img src={Icon} alt="icon" />
          <p>{localeTexts.ConfigScreen.title}</p>
        </div>

        <div className={`${styles.configWrapper}`}>
          {/* Contentstack Configuration */}
          <p className={styles.locationDescriptionText}>Contentstack Configuration</p>
          <div className={`${styles.configContainer}`}>
            {renderField(
              "Stack API Key",
              "contentstack_stack_api_key",
              "Your Contentstack Stack API Key"
            )}
            {renderField(
              "Delivery Token",
              "contentstack_delivery_token",
              "Content Delivery Token"
            )}
            {renderField(
              "Environment",
              "contentstack_environment",
              "Environment name (e.g., development)"
            )}
          </div>

          {/* Pinecone Configuration */}
          <p className={styles.locationDescriptionText}>Pinecone Configuration</p>
          <div className={`${styles.configContainer}`}>
            {renderField(
              "Pinecone API Key",
              "pinecone_api_key",
              "Your Pinecone API Key (stored securely)",
              true
            )}
            {renderField(
              "Pinecone Environment",
              "pinecone_environment",
              "e.g., gcp-starter, us-east1-gcp"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationExtension;
