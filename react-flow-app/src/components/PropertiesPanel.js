import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

function PropertiesPanel({ node, onNodeDataChange }) {
  const [schema, setSchema] = useState(null);
  const { register, handleSubmit, watch, reset, setValue } = useForm();

  // Load schema when node changes
  useEffect(() => {
    if (node) {
      setSchema(null);
      import(`@/schemas/${node.type}.schema.json`)
        .then((module) => {
          setSchema(module.default);
          // Reset the form with the node's data once the schema is loaded
          reset(node.data);
        })
        .catch((err) => {
          console.error("Failed to load schema:", err);
          setSchema(null);
        });
    } else {
      setSchema(null);
    }
  }, [node, reset]);

  // Watch for form changes and propagate them to the parent
  useEffect(() => {
    if (!onNodeDataChange || !node) return;

    const subscription = watch((value) => {
      onNodeDataChange(node.id, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onNodeDataChange, node]);

  const renderField = (key, properties) => {
    const commonProps = { ...register(key) };

    switch (properties.type) {
      case 'string':
        if (properties.format === 'textarea') {
          return <Textarea {...commonProps} className="mt-1" />;
        }
        return <Input type="text" {...commonProps} className="mt-1" />;
      case 'number':
        // react-hook-form doesn't natively support a slider, so we need to manage it.
        const currentValue = watch(key, properties.default);
        return (
          <div className="flex items-center space-x-2 mt-1">
            <Slider
              min={properties.minimum}
              max={properties.maximum}
              step={properties.step || 1}
              value={[currentValue]}
              onValueChange={(vals) => setValue(key, vals[0], { shouldDirty: true })}
            />
            <span className="text-sm w-16 text-center">{currentValue}</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!node) {
    return (
      <div className="p-6 h-full flex items-center justify-center text-muted-foreground">
        <p>Select a node to view its properties.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h3 className="font-semibold text-xl border-b pb-2">
        {schema ? schema.title : 'Properties'}
      </h3>
      {schema ? (
        <form onSubmit={handleSubmit(() => {})}>
          {Object.entries(schema.properties).map(([key, properties]) => (
            <div key={key} className="mb-4">
              <Label htmlFor={key} className="font-semibold">{properties.title}</Label>
              {renderField(key, properties)}
            </div>
          ))}
        </form>
      ) : (
        <p className="text-muted-foreground">Loading schema or no schema available...</p>
      )}
    </div>
  );
}

export default PropertiesPanel;
