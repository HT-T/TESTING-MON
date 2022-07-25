import React, { useState } from "react";
import { Button, Box, Input } from "@chakra-ui/react";


function ModManager(props) {
  // Our mods and setMods is now passed down from App
  const { mods, setMods } = props;

  const [newModText, setNewModText] = useState("");

  function handleAddMod(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    event.preventDefault();
    addMod(newModText);
    setNewModText("");
  }

  function addMod(description) {
    const newMods = [
      // the ... operator is called the spread operator
      // what we are doing is creating a brand new array of
      // mods, that is different from the previous array
      // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      ...mods,
      {
        name: description,
      }
    ];
    setMods(newMods);
    console.log(newMods);
  }

  return (
    <>
      <Box>
        <h2>Add mods</h2>
        <form onSubmit={handleAddMod}>
          <Input
            label="Description"
            value={newModText}
            onChange={(event) => setNewModText(event.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </form>
      </Box>

      <Box>
        <h2>Mod List</h2>
        {mods.length > 0 ? (
          <ModList mods={mods} setMods={setMods} />
        ) : (
          <p>No mods yet! Add one above!</p>
        )}
      </Box>
    </>
  );
}

function ModList(props) {
  const { mods, setMods } = props;


  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Mod Name</th>
        </tr>
      </thead>
      <tbody>
        {mods.map((mod, index) => (
          // We should specify key here to help react identify
          // what has updated
          // https://reactjs.org/docs/lists-and-keys.html#keys
          <tr key={mod.name}>
            <td>{index + 1}</td>
            <td>{mod.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default ModManager;